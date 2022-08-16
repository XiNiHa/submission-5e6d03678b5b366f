import { createContext, useContext } from 'react'
import type React from 'react'
import { useAuthContext } from '@/auth'
import { match, P } from 'ts-pattern'

type CustomFetch = (
  pathname: string,
  auth: boolean,
  init?: RequestInit
) => Promise<Response | Error>

interface ApiContextProps {
  fetch: CustomFetch
}

const ApiContext = createContext<ApiContextProps>({
  fetch: (pathname, _, init) =>
    fetch(`${import.meta.env.VITE_API_URL as string}${pathname}`, init),
})

export const ApiProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const authContext = useAuthContext()

  const fetchImpl: CustomFetch = (pathname, auth, init) =>
    fetch(`${import.meta.env.VITE_API_URL as string}${pathname}`, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
        ...(auth && authContext.accessToken
          ? { Authorization: `Bearer ${authContext.accessToken}` }
          : null),
      },
    }).catch((e) => e as Error)

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
