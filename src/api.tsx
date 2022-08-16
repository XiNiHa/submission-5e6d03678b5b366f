import { createContext, useContext, useRef } from 'react'
import { match, P } from 'ts-pattern'
import type React from 'react'
import { useAuthContext } from '@/auth'

type CustomFetch = <T>(
  pathname: string,
  auth: boolean,
  init?: RequestInit
) => Promise<ResponseResult<T>>

interface ApiContextProps {
  fetch: CustomFetch
}

const ApiContext = createContext<ApiContextProps>({
  fetch: () => {
    throw new Error('Context provider not found')
  },
})

export const ApiProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const authContext = useAuthContext()

  const fetchImpl: CustomFetch = <T,>(pathname: string, auth: boolean, init?: RequestInit) =>
    fetch(`${import.meta.env.VITE_API_URL as string}${pathname}`, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
        ...(auth && authContext.accessToken
          ? { Authorization: `Bearer ${authContext.accessToken}` }
          : null),
      },
    })
      .catch((e) => e as Error)
      .then(handleResponse<T>)

  return (
    <ApiContext.Provider value={{ fetch: fetchImpl }}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApiContext = () => useContext(ApiContext)

export interface ErrorResponse {
  error: {
    message: string
  }
}

type ResponseResult<T> = { success: T } | { error: { message: string } }

export const handleResponse = async <T,>(
  res: Response | Error
): Promise<ResponseResult<T>> => {
  return match(res)
    .with({ status: 200 }, async (res) => ({
      success: (await res.json()) as T,
    }))
    .with(
      { status: P.number },
      async (res) => (await res.json()) as ErrorResponse
    )
    .otherwise((e) => {
      console.error(e)
      return {
        error: { message: '알 수 없는 에러가 발생하였습니다.' },
      }
    })
}
