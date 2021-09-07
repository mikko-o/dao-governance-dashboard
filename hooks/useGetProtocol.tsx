import { useCallback, useMemo } from 'react'
import { Icon, Protocol } from '../types'

const useGetProtocol = (protocols: Protocol[]) => {
  const protocolCnameMap = useMemo(() => {
    const map: Record<string, Protocol> = {}
    protocols.forEach((protocol) => {
      map[protocol.cname] = protocol
    })
    return map
  }, [protocols])

  const getProtocol = useCallback(
    (cname: string): Protocol => {
      return protocolCnameMap[cname]
    },
    [protocolCnameMap]
  )

  return getProtocol
}

export default useGetProtocol
