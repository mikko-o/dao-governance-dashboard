import { useCallback, useMemo } from 'react'
import { KeyLoader, useSWRInfinite } from 'swr'
import { swrFetcher } from '../api'
import { ApiResponse, Proposal, Protocol, Vote } from '../types'

const options = {
  revalidateOnMount: false,
}

const useInfiniteData = <T>(
  key: string,
  limit: number,
  initialData?: ApiResponse<T[]>
) => {
  const getKey: KeyLoader<ApiResponse<T[]>> = useCallback(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.nextCursor) return null
      // first page, we don't have `previousPageData`
      if (pageIndex === 0 || !previousPageData) return `${key}?limit=${limit}`
      // add the cursor to the API endpoint
      return `${key}?cursor=${previousPageData.nextCursor}&limit=${limit}`
    },
    [key, limit]
  )

  const { data, size, setSize } = useSWRInfinite(
    getKey,
    swrFetcher,
    initialData
      ? {
          ...options,
          initialData: [initialData],
        }
      : { ...options }
  )

  const finalData = useMemo(
    () => data && data.reduce((a, b) => [...a, ...b.data], [] as T[]),
    [data]
  )

  const fetchData = useCallback(() => {
    setSize((size) => size + 1)
  }, [setSize])

  const hasMore = useMemo(
    () => data !== undefined && data[data.length - 1]?.nextCursor !== undefined,
    [data]
  )

  return { data: finalData, fetchData, hasMore, size, pageData: data }
}

export default useInfiniteData
