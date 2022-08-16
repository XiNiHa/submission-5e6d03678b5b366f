import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'
import type React from 'react'
import { useApiContext } from '@/api'
import * as AlertDialog from '@/components/AlertDialog'
import SuspenseImage from '@/components/SuspenseImage'

interface UserInfoResponse {
  name: string
  email: string
  profileImage: string
  lastConnectedAt: Date
}

const Me: React.FC = () => {
  const [inFlight, setInFlight] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { fetch, fetchSuspend } = useApiContext()
  const navigate = useNavigate()

  const { data } = fetchSuspend<UserInfoResponse>('userData', '/api/user', true)

  if ('error' in data) return <Navigate to="/login" />

  const logout = async () => {
    setInFlight(true)

    const result = await fetch('/api/logout', true, { method: 'POST' })
    if ('error' in result) setError(result.error.message)
    else navigate('/login')

    setInFlight(false)
  }

  return (
    <div className="flex-col-center" uno-w="full" uno-h="full">
      <main
        className="flex-col-center"
        uno-p="8"
        uno-border="rounded-xl"
        uno-bg="white"
        uno-shadow="lg"
        uno-flex="gap-8"
      >
        <h1 uno-text="3xl" uno-font="bold">
          내 정보
        </h1>
        <SuspenseImage
          src={data.success.profileImage}
          width={256}
          height={256}
        />
        <div className="flex-col-center">
          <span uno-text="2xl" uno-font="medium">
            {data.success.name}
          </span>
          <span uno-text="xl">({data.success.email})</span>
        </div>
        <button
          onClick={() => void logout()}
          disabled={inFlight}
          uno-p="x-6 y-2"
          uno-border="rounded"
          uno-text="lg #FFF"
          uno-font="medium"
          uno-bg="red-400 hover:red-300"
          uno-transition="colors duration-300"
        >
          로그아웃
        </button>
      </main>
      <AlertDialog.Root open={error != null}>
        <AlertDialog.Content>
          <AlertDialog.Title>로그아웃 실패</AlertDialog.Title>
          <AlertDialog.Description>{error}</AlertDialog.Description>
          <div uno-flex="~" uno-justify="end">
            <AlertDialog.Action asChild>
              <button
                onClick={() => setError(null)}
                uno-p="x-4 y-2"
                uno-text="white lg"
                uno-font="medium"
                uno-bg="red-400 hover:red-300"
                uno-border="rounded"
                uno-transition="colors duration-300"
              >
                확인
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  )
}

export default Me
