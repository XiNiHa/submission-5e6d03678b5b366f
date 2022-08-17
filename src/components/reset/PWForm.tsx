import { useState } from 'react'
import type React from 'react'
import * as AlertDialog from '@/components/AlertDialog'
import { useApiContext } from '@/api'
import { match, P } from 'ts-pattern'
import usePlane from '@/usePlane'
import { useNavigate } from 'react-router-dom'
import InputRow from '../InputRow'

interface Props {
  email: string
  confirmToken: string
}

interface ChangePasswordResponse {
  email: string
}

const EmailForm: React.FC<Props> = ({ email, confirmToken }) => {
  const { inFlight, fly } = usePlane()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { fetch } = useApiContext()
  const navigate = useNavigate()

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    void fly(async () => {
      const formData = new FormData(e.currentTarget)
      const newPassword = formData.get('password')
      const newPasswordConfirm = formData.get('confirm')

      if (
        typeof newPassword === 'string' &&
        typeof newPasswordConfirm === 'string'
      ) {
        const result = await fetch<ChangePasswordResponse>(
          `/api/reset-password`,
          false,
          {
            method: 'PATCH',
            body: JSON.stringify({
              email,
              confirmToken,
              newPassword,
              newPasswordConfirm,
            }),
          }
        )
        match(result)
          .with({ success: P.any }, () => navigate('/login'))
          .with({ error: { message: P.select() } }, (msg) => setError(msg))
          .run()
      }
    })
  }

  return (
    <form
      onSubmit={(e) => void onFormSubmit(e)}
      className="flex-col-center"
      uno-p="y-2"
      uno-flex="gap-6"
    >
      <div className="flex-col-center" uno-flex="gap-4">
        <InputRow label="비밀번호" icon="i-bi-lock">
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
              <div className={showPassword ? 'i-bi-eye-fill' : 'i-bi-eye'} />
            </button>
          </div>
        </InputRow>
        <InputRow label="비밀번호 확인" icon="i-bi-check">
          <div uno-pos="relative" uno-m="x-2">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirm"
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
              <div className={showPassword ? 'i-bi-eye-fill' : 'i-bi-eye'} />
            </button>
          </div>
        </InputRow>
      </div>
      <button
        disabled={inFlight}
        uno-p="x-12 y-2"
        uno-bg="green-400 hover:green-300"
        uno-border="rounded"
        uno-text="xl"
        uno-font="medium"
        uno-transition="colors duration-300"
      >
        다음
      </button>
      <AlertDialog.Root open={error != null}>
        <AlertDialog.Content>
          <AlertDialog.Title>코드 발급 실패</AlertDialog.Title>
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
    </form>
  )
}

export default EmailForm
