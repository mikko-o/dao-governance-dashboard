import TimeAgo from 'javascript-time-ago'
import Link from 'next/link'
import { useRef } from 'react'
import { useEffect, useState } from 'react'
import Blockies from 'react-blockies'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getVoters, getVotes } from '../api'
import useInfiniteData from '../hooks/useInfiniteData'
import { ApiResponse, Protocol, Vote as VoteInterface, Voter } from '../types'
import { formatAddress } from '../utils'
import ProtocolIcon from './ProtocolIcon'

interface LatestVotesProps {
  initialLatestVoters: ApiResponse<Voter[]>
  getProtocol: (cname: string) => Protocol
}

const timeAgo = new TimeAgo()

const LatestVotes: React.FC<LatestVotesProps> = ({
  initialLatestVoters,
  getProtocol,
}) => {
  const [votes, setVotes] = useState<VoteInterface[] | undefined>(undefined)
  const limit = initialLatestVoters?.data.length ?? 5
  const { data, fetchData, hasMore, size, pageData } = useInfiniteData(
    `/voters`,
    limit,
    initialLatestVoters
  )
  const scrollRef = useRef(null)

  useEffect(() => {
    if (pageData && pageData.length == size) {
      const fetchVotes = async () => {
        const requests = pageData[size - 1].data.map((voter) =>
          getVotes({ address: voter.address }, { limit: 1 }).then(
            (votes) => votes.data[0]
          )
        )
        const voterData = (await Promise.all(requests)).filter((x) => x)
        setVotes((data) => {
          if (data === undefined) return voterData
          else return [...data, ...voterData]
        })
      }
      fetchVotes()
    }
  }, [pageData, size])

  if (!data || !pageData || !votes) return <div className="h-96 w-72" />
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl text-gray-700">Recent voters</h2>

      <div
        ref={scrollRef}
        id="scroll-target-latest-votes"
        className="h-96 max-w-xl overflow-scroll"
      >
        <InfiniteScroll
          dataLength={data.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          scrollableTarget={'scroll-target-latest-votes'}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>end</b>
            </p>
          }
        >
          <div className="flex flex-col divide-y divide-gray-200 divi">
            {votes.map((vote, i) => (
              <div key={vote.address} className="py-3">
                <Vote
                  vote={vote}
                  protocol={vote ? getProtocol(vote.protocol) : undefined}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default LatestVotes

interface VoteProps {
  vote?: VoteInterface
  protocol?: Protocol
}

const Vote = ({ vote, protocol }: VoteProps) => {
  if (!vote || !protocol) return null
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-1 hover:text-gray-400">
          <Link href={`/proposals/${protocol.cname}`}>
            <a>
              <ProtocolIcon size={'small'} icons={protocol.icons} sizePx={16} />
              {protocol.name}
            </a>
          </Link>
        </div>

        <div className="text-xs bg-gray-100 rounded-xl px-2 py-1">
          {timeAgo.format(vote.timestamp * 1000)}
        </div>
      </div>

      <Link href={`/proposals/${vote.protocol}?refId=${vote.proposalRefId}`}>
        <a className="text-gray-800 text-lg tracking-wide font-light hover:text-gray-500">
          {vote.proposalInfo.title}
        </a>
      </Link>

      <div className="flex gap-1 items-center">
        <div className="text-base tracking-wide">
          {formatAddress(vote.address)}:{' '}
          {vote.proposalInfo.choices[vote.choice] ?? '[?]'}
        </div>
      </div>
    </div>
  )
}
