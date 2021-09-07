import Image from 'next/image'
import { Icon, IconSize } from '../types'

interface ProtocolIconProps {
  icons?: Icon[]
  size: IconSize
  sizePx: number | string
}

const ProtocolIcon: React.FC<ProtocolIconProps> = ({ icons, size, sizePx }) => {
  if (!icons || icons.length === 0) return null

  const icon = icons.find((icon) => icon.size === size)

  if (icon)
    return (
      <Image
        width={sizePx}
        height={sizePx}
        src={icon.url}
        alt="DAO protocol icon"
      />
    )

  let index = 0
  if (size === 'large') index = Math.min(icons.length - 1, 2)
  else if (size === 'small') index = Math.min(icons.length - 1, 1)
  else if (size === 'thumb') index = 0

  return (
    <Image
      width={sizePx}
      height={sizePx}
      src={icons[index].url}
      alt="DAO protocol icon"
    />
  )
}

export default ProtocolIcon
