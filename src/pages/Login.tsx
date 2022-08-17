import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { match, P } from 'ts-pattern'
import type React from 'react'
import { useAuthContext } from '@/auth'
import { useApiContext } from '@/api'
import usePlane from '@/usePlane'
import * as AlertDialog from '@/components/AlertDialog'
import InputRow from '@/components/InputRow'

interface LoginSuccessResponse {
  accessToken: string
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { inFlight, fly } = usePlane()

  const { update: updateToken } = useAuthContext()
  const { fetch } = useApiContext()
  const navigate = useNavigate()

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    void fly(async () => {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email')
      const password = formData.get('password')

      if (email && password) {
        const result = await fetch<LoginSuccessResponse>(`/api/login`, false, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })

        match(result)
          .with({ success: { accessToken: P.select() } }, (token) => {
            updateToken(token)
            setTimeout(() => navigate('/'), 0)
          })
          .with({ error: { message: P.select() } }, (msg) => setError(msg))
          .run()
      }
    })
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
          로그인
        </h1>
        <form
          onSubmit={(e) => void onFormSubmit(e)}
          className="flex-col-center"
          uno-flex="gap-5"
        >
          <div className="flex-col-center" uno-flex="gap-3">
            <InputRow icon="i-bi-envelope" label="이메일">
              <input
                type="text"
                name="email"
                inputMode="email"
                required
                className="input"
                uno-m="x-2"
              />
            </InputRow>
            <InputRow icon="i-bi-lock" label="비밀번호">
              <div uno-pos="relative" uno-m="x-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="input"
                />
                <button
                  type="button"
                  title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  uno-p="x-3"
                  uno-pos="absolute inset-0 left-auto"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <div
                    className={showPassword ? 'i-bi-eye-fill' : 'i-bi-eye'}
                  />
                </button>
              </div>
            </InputRow>
          </div>
          <Link to="/reset" uno-text="gray-500" uno-underline="hover:~">
            비밀번호 초기화
          </Link>
          <button
            disabled={inFlight}
            uno-p="x-12 y-2"
            uno-bg="green-400 hover:green-300"
            uno-border="rounded"
            uno-text="xl"
            uno-font="medium"
            uno-transition="colors duration-300"
          >
            로그인
          </button>
        </form>
      </main>
      <AlertDialog.Root open={error != null}>
        <AlertDialog.Content>
          <AlertDialog.Title>로그인 실패</AlertDialog.Title>
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



export default Login
