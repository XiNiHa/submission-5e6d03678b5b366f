import { useEffect, useRef, useState } from 'react'
import type React from 'react'
import * as AlertDialog from '@/components/AlertDialog'
import { useApiContext } from '@/api'
import { match, P } from 'ts-pattern'
import usePlane from '@/usePlane'
import InputRow from '../InputRow'

interface Props {
  email: string
  issueToken: string
  expiresAt: Date
  onSuccess?: (confirmToken: string) => void
  onBack?: () => void
}

interface SendResetCodeResponse {
  confirmToken: string
}

const CodeForm: React.FC<Props> = ({
  email,
  issueToken,
  expiresAt,
  onSuccess,
  onBack,
}) => {
  const { inFlight, fly } = usePlane()
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)

  const { fetch } = useApiContext()

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    void fly(async () => {
      const formData = new FormData(e.currentTarget)
      const authCode = formData.get('authCode')?.toString()

      if (authCode) {
        const result = await fetch<SendResetCodeResponse>(
          `/api/reset-password`,
          false,
          {
            method: 'POST',
            body: JSON.stringify({
              email,
              authCode,
              issueToken,
            }),
          }
        )
        match(result)
          .with({ success: { confirmToken: P.select() } }, (token) =>
            onSuccess?.(token)
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
      <InputRow label="인증 코드" icon="i-bi-lock">
        <input
          type="text"
          name="authCode"
          inputMode="numeric"
          required
          className="input"
          uno-m="x-2"
        />
      </InputRow>
      <Counter expiresAt={expiresAt} onExpired={() => setExpired(true)} />
      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          onClick={() => onBack?.()}
          uno-p="x-12 y-2"
          uno-bg="gray-300 hover:gray-200"
          uno-border="rounded"
          uno-text="xl"
          uno-font="medium"
          uno-transition="colors duration-300"
        >
          뒤로
        </button>
        <button
          disabled={expired || inFlight}
          uno-p="x-12 y-2"
          uno-bg="green-400 hover:green-300 !disabled:gray-400"
          uno-border="rounded"
          uno-text="xl"
          uno-font="medium"
          uno-transition="colors duration-300"
        >
          다음
        </button>
      </div>
      <AlertDialog.Root open={error != null}>
        <AlertDialog.Content>
          <AlertDialog.Title>인증 실패</AlertDialog.Title>
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

interface CounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  expiresAt: Date
  onExpired?: () => void
}

const usePrev = <T,>(value: T) => {
  const ref = useRef<T | null>(null)
  useEffect(() => void (ref.current = value), [value])
  return ref.current
}

const Counter: React.FC<CounterProps> = ({
  expiresAt,
  onExpired,
  ...attrs
}) => {
  const [now, setNow] = useState(Date.now())
  const totalRemaining = Math.max((expiresAt.getTime() - now) / 1000, 0)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()))
    return () => clearInterval(id)
  }, [])

  const prevRemaining = usePrev(totalRemaining)
  useEffect(() => {
    if ((prevRemaining ?? Number.MAX_SAFE_INTEGER) > 0 && totalRemaining === 0)
      onExpired?.()
  }, [totalRemaining, prevRemaining])

  const minutes = Math.floor(totalRemaining / 60)
    .toFixed(0)
    .padStart(2, '0')
  const seconds = (totalRemaining % 60).toFixed(0).padStart(2, '0')
  const display = `${minutes}:${seconds}`

  return <span {...attrs}>{display}</span>
}

export default CodeForm
