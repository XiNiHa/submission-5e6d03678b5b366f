import { useState } from 'react'
import type React from 'react'
import { match, P } from 'ts-pattern'
import * as AlertDialog from '@/components/AlertDialog'
import { useApiContext } from '@/api'
import usePlane from '@/usePlane'
import InputRow from '../InputRow'

interface Props {
  onSuccess?: (payload: OnSuccessPayload) => void
}

interface OnSuccessPayload {
  email: string
  expiresAt: Date
  issueToken: string
}

interface GetResetCodeResponse {
  issueToken: string
  remainMillisecond: number
}

const EmailForm: React.FC<Props> = ({ onSuccess }) => {
  const { inFlight, fly } = usePlane()
  const [error, setError] = useState<string | null>(null)

  const { fetch } = useApiContext()

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    void fly(async () => {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email')

      if (typeof email === 'string') {
        const result = await fetch<GetResetCodeResponse>(
          `/api/reset-password?email=${encodeURIComponent(email)}`,
          false
        )
        match(result)
          .with({ success: P.select() }, ({ issueToken, remainMillisecond }) =>
            onSuccess?.({
              email,
              issueToken,
              expiresAt: new Date(Date.now() + remainMillisecond),
            })
          )
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
      <InputRow label="이메일" icon="i-bi-envelope">
        <input
          type="text"
          name="email"
          inputMode="email"
          required
          className="input"
          uno-m="x-2"
        />
      </InputRow>
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
