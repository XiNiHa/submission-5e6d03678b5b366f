const cache = new Map<string, Promise<unknown> | true>()

const SuspenseImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props
) => {
  const { src } = props
  if (!src) return null

  let current = cache.get(src)
  if (!current) {
    current = new Promise((res, rej) => {
      const img = new Image()
      img.onload = () => res(true)
      img.onerror = rej
      img.src = src
    }).then(() => cache.set(src, true))
    cache.set(src, current)
  }
  if (current !== true) throw current

  return <img {...props} />
}

export default SuspenseImage
