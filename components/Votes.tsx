import InfiniteScroll from 'react-infinite-scroll-component'
import { ApiResponse, Proposal, Vote } from '../types'
import { MutableRefObject, useMemo } from 'react'
import { swrFetcher } from '../api'
import Blockies from 'react-blockies'
import useInfiniteData from '../hooks/useInfiniteData'
import { formatAddress, formatPercentage } from '../utils'

interface VotesProps {
  totalPower?: number
  proposal: Proposal
  votes?: ApiResponse<Vote[]> | null
  scrollableTarget: MutableRefObject<any> | string
}

const limit = 10

const Votes: React.FC<VotesProps> = ({
  totalPower,
  proposal,
  votes,
  scrollableTarget,
}) => {
  if (!votes || !totalPower) return null

  return (
    <ul className="flex flex-col gap-8">
      {votes.data.map((vote) => (
        <li key={vote.refId} className="flex items-center gap-2">
          <div className="rounded-full overflow-hidden bg-gray-400 shadow flex flex-grow-0 flex-shrink-0">
            <Blockies seed={vote.address} scale={4} />
          </div>
          <p>
            {formatAddress(vote.address)} voted {proposal.choices[vote.choice]}{' '}
            ({formatPercentage(vote.power / totalPower)})
          </p>
        </li>
      ))}
    </ul>
  )
}

export default Votes
