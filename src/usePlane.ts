import { useState } from 'react'

const usePlane = () => {
  const [inFlight, setInFlight] = useState(false)

  const fly = async <T>(asyncFn: () => Promise<T>) => {
    setInFlight(true)
    const result = await asyncFn().finally(() => setInFlight(false))
    return result
  }

  return { inFlight, fly }
}

export default usePlane
