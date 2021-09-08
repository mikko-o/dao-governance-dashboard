import { groupBy, orderBy, dropRightWhile } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BarItem, ChartItem, Result, Vote } from '../types'
import { formatAddress } from '../utils'

const useBarChartData = (
  results?: Result[],
  choices?: string[],
  votes?: Vote[]
) => {
  const sortedVotes = useMemo(
    () => orderBy(votes, (vote) => vote.timestamp),
    [votes]
  )
  const votesGrouped = useMemo(
    () => groupBy(sortedVotes, (vote) => vote.choice),
    [sortedVotes]
  )

  const getInitialState: () => Record<string, BarItem> = useCallback(() => {
    const state: Record<string, BarItem> = {}
    choices &&
      results?.forEach((result) => {
        const choice = choices[result.choice]
        state[choice] = { choice }
      })
    return state
  }, [choices, results])

  const [barChoiceData, setBarChoiceData] = useState<Record<string, BarItem>>(
    getInitialState()
  )

  useEffect(() => {
    if (choices) {
      const newData = getInitialState()
      votes?.forEach((vote) => {
        const choice = choices[vote.choice]
        if (newData[choice])
          newData[choice][formatAddress(vote.address)] = vote.power
      })
      setBarChoiceData(newData)
    }
  }, [votes, choices, getInitialState])

  const keys = votes?.reduce(
    (k, vote) => [...k, formatAddress(vote.address)],
    [] as string[]
  )

  return { barChartData: Object.values(barChoiceData), keys }
}

export default useBarChartData
