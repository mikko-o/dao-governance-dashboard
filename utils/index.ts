import TimeAgo from 'javascript-time-ago'
import { QueryOptions } from '../types'

export function isQueryOptions(object: unknown): object is QueryOptions {
  return (
    Object.prototype.hasOwnProperty.call(object, 'name') &&
    Object.prototype.hasOwnProperty.call(object, 'age')
  )
}

export const formatPercentage = (num: number) => Math.round(num * 100) + '%'

export const formatAddress = (address: string, separator: string = '-') => {
  const capitalized =
    address.substring(0, 2) + address.substring(2, address.length).toUpperCase()
  return (
    capitalized.substring(0, 4) +
    separator +
    capitalized.substring(capitalized.length - 4, capitalized.length)
  )
}

export const timeAgo = new TimeAgo()
