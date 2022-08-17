import { match } from 'ts-pattern'
import type React from 'react'

type ElType<T extends React.ReactHTMLElement<HTMLElement>> =
  T extends React.ReactHTMLElement<infer P> ? P : never

interface Props<T extends React.ReactHTMLElement<HTMLElement>> {
  active: boolean
  transitioning?: boolean
  enterProps?: React.HTMLAttributes<ElType<T>>
  activeProps?: React.HTMLAttributes<ElType<T>>
  leaveProps?: React.HTMLAttributes<ElType<T>>
  children: React.ReactElement
}

type State = 'enter' | 'active' | 'leave' | 'inactive'

const reduce = (active: boolean, transitioning: boolean) =>
  match<[boolean, boolean], State>([active, transitioning])
    .with([true, true], () => 'enter')
    .with([true, false], () => 'active')
    .with([false, true], () => 'leave')
    .with([false, false], () => 'inactive')
    .exhaustive()

const Transitioning = <T extends React.ReactHTMLElement<HTMLElement>>(
  props: Props<T>
): React.ReactElement => {
  const current = reduce(props.active, props.transitioning ?? false)
  if (current === 'inactive') return <></>

  return {
    ...props.children,
    // ReactElement.props is any
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    props: {
      ...props.children.props,
      ...{
        enter: props.enterProps,
        active: props.activeProps,
        leave: props.leaveProps,
      }[current],
    },
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
}

export default Transitioning
