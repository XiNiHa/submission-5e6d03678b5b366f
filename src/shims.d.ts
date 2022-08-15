import type { AttributifyNames } from '@unocss/preset-attributify'

type Prefix = 'uno-'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T>
    extends Partial<Record<AttributifyNames<Prefix>, string>> {}
}
