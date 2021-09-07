import { useMemo } from 'react'
import { ChartItem, Result } from '../types'

const useChartData = (
  results?: Result[],
  choices?: string[]
): ChartItem[] | undefined => {
  return useMemo(() => {
    if (!results || !choices) return undefined
    return results.map((result, index) => {
      const choice = choices[result.choice]
      return {
        id: choice + '-' + index,
        label: choice,
        value: result.total,
      }
    })
  }, [results, choices])
}

export default useChartData
