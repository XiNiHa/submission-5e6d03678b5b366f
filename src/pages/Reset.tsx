import { Children, forwardRef, useEffect, useRef, useState } from 'react'
import type React from 'react'
import Transitioning from '@/components/Transitioning'
import EmailForm from '@/components/reset/EmailForm'
import CodeForm from '@/components/reset/CodeForm'
import PWForm from '@/components/reset/PWForm'

type View = 'emailform' | 'codeform' | 'pwform'

const order: View[] = ['emailform', 'codeform', 'pwform']

interface Data {
  email: string
  issueToken: string
  expiresAt: Date
  confirmToken?: string
}

const Reset: React.FC = () => {
  const [view, setView] = useState<View>('emailform')
  const [transitioning, setTransitioning] = useState(false)
  const [data, setData] = useState<Data | null>(null)

  const viewbox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const curr = viewbox.current
    if (!curr) return

    const onStart = () => setTransitioning(true)
    const onEnd = () => setTransitioning(false)
    curr.addEventListener('transitionstart', onStart)
    curr.addEventListener('transitionend', onEnd)
    return () => {
      curr.removeEventListener('transitionstart', onStart)
      curr.removeEventListener('transitionend', onEnd)
    }
  }, [viewbox.current])

  const navigateView = (view: View) => {
    setView(view)
    setTransitioning(true)
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
          비밀번호 재설정
        </h1>
        <Viewbox ref={viewbox} index={order.indexOf(view)}>
          <Transitioning
            active={view === 'emailform'}
            transitioning={transitioning}
          >
            <EmailForm
              onSuccess={(payload) => {
                setData(payload)
                navigateView('codeform')
              }}
            />
          </Transitioning>
          <Transitioning
            active={view === 'codeform'}
            transitioning={transitioning}
          >
            {data ? (
              <CodeForm
                {...data}
                onSuccess={(confirmToken) => {
                  setData((prev) => prev && { ...prev, confirmToken })
                  navigateView('pwform')
                }}
                onBack={() => navigateView('emailform')}
              />
            ) : (
              <div />
            )}
          </Transitioning>
          <Transitioning
            active={view === 'pwform'}
            transitioning={transitioning}
          >
            {data?.confirmToken ? (
              <PWForm
                {...data}
                confirmToken={
                  /* workaround to utilize TS contextual analysis */ data.confirmToken
                }
              />
            ) : (
              <div />
            )}
          </Transitioning>
        </Viewbox>
      </main>
    </div>
  )
}

interface ViewboxProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
}

const Viewbox = forwardRef<HTMLDivElement, ViewboxProps>((props, ref) => {
  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const offset = props.index * -100

  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        setWrapperWidth(wrapperRef.current.offsetWidth)
      }
    }

    const observer = new ResizeObserver(updateSize)
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current)
    }
    updateSize()
    return () => observer.disconnect()
  }, [])

  return (
    <div uno-overflow="hidden" uno-max-w="[500px]" ref={wrapperRef}>
      <div
        ref={ref}
        uno-flex="~"
        uno-items="center"
        uno-min-h="[300px]"
        uno-transition="transform duration-1000"
        style={{ transform: `translateX(${offset}%)` }}
      >
        {Children.map(props.children, (child) => (
          <div
            style={{ minWidth: wrapperWidth ? `${wrapperWidth}px` : 'auto' }}
          >
            <div className="flex-col-center">{child}</div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default Reset
