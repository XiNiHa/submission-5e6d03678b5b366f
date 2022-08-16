import { createContext, useContext, useRef } from 'react'
import { match, P } from 'ts-pattern'
import type React from 'react'
import { useAuthContext } from '@/auth'

type CustomFetch = <T>(
  pathname: string,
  auth: boolean,
  init?: RequestInit
) => Promise<ResponseResult<T>>

type SuspenseFetch = <T>(
  key: string,
  pathname: string,
  auth: boolean,
  init?: RequestInit
) => {
  data: ResponseResult<T>
  clear: () => void
}

interface ApiContextProps {
  fetch: CustomFetch
  fetchSuspend: SuspenseFetch
}

const ApiContext = createContext<ApiContextProps>({
  fetch: () => {
    throw new Error('Context provider not found')
  },
  fetchSuspend: () => {
    throw new Error('Context provider not found')
  },
})

export const ApiProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  type CacheState =
    | {
        status: 'pending'
        promise: Promise<unknown>
      }
    | {
        status: 'resolved'
        data: ResponseResult<unknown>
      }

  const authContext = useAuthContext()
  const cache = useRef(new Map<string, CacheState>())

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

  const fetchSuspend: SuspenseFetch = <T,>(
    key: string,
    ...params: Parameters<CustomFetch>
  ) => {
    let current = cache.current.get(key)
    if (!current) {
      current = {
        status: 'pending',
        promise: fetchImpl(...params).then((data) =>
          cache.current.set(key, { status: 'resolved', data })
        ),
      }
      cache.current.set(key, current)
    }
    switch (current.status) {
      case 'pending':
        throw current.promise
      case 'resolved':
        return {
          data: current.data as ResponseResult<T>,
          clear: () => cache.current.delete(key),
        }
    }
  }

  return (
    <ApiContext.Provider value={{ fetch: fetchImpl, fetchSuspend }}>
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
