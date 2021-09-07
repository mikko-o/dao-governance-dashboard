import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import Blockies from 'react-blockies'
import TimeAgo from 'javascript-time-ago'
import { getProtocol, getVoters } from '../../api'
import Header from '../../components/Header'
import ProtocolIcon from '../../components/ProtocolIcon'
import useInfiniteData from '../../hooks/useInfiniteData'
import {
  ApiResponse,
  Protocol,
  Voter as VoterInterface,
  VProtocol,
} from '../../types'
import { resolveEnsName } from '../../utils/ens'
import { formatAddress, formatPercentage } from '../../utils'

interface LeaderboardPageProps {
  voters: ApiResponse<VoterInterface[]>
  protocol: ApiResponse<Protocol>
  ensNames: Record<string, string>
  totalPowerCast: number
}

const getProtocolVoterData = (voter: VoterInterface, protocol: Protocol) =>
  voter.protocols.find((p) => p.protocol === protocol.cname) as VProtocol

const timeAgo = new TimeAgo()

const Leaderboard: NextPage<LeaderboardPageProps> = ({
  voters,
  protocol,
  ensNames,
  totalPowerCast,
}) => {
  return (
    <div
      id="target"
      className="bg-background w-screen h-screen overflow-auto flex flex-col items-center"
    >
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <header className="mb-6">
        <div className="p-6 w-screen bg-gray-800 text-gray-300 rounded-b-xl shadow flex gap-6 items-center">
          <div className="">
            <Link href={`/proposals/${protocol.data.cname}`}>
              <a>Proposals</a>
            </Link>
          </div>
          <div className="text-indigo-300 text-lg">Voter leaderboard</div>
        </div>
      </header>

      <main className="w-full sm:w-10/12 xl:w-8/12 grid grid-cols-1 gap-6">
        <div className="p-8 bg-white rounded-xl shadow flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <ProtocolIcon
              sizePx={42}
              size="large"
              icons={protocol.data.icons}
            />
            <h1 className="text-4xl font-wide font-thin whitespace-nowrap">
              {protocol.data.name}
            </h1>
          </div>

          <div className="text-sm md:text-base flex gap-2 lg:gap-6">
            <div className="px-2 py-1 border border-gray-300 rounded-2xl text-gray-700 whitespace-nowrap">
              {protocol.data.uniqueVoters} Voters
            </div>

            <div className="px-2 py-1 border border-gray-300 rounded-2xl text-gray-700 whitespace-nowrap">
              {protocol.data.totalVotes} Votes
            </div>

            <div className="px-2 py-1 border border-gray-300 rounded-2xl text-gray-700 whitespace-nowrap">
              {protocol.data.totalProposals} Proposals
            </div>
          </div>
        </div>

        <div className="p-8 pt-4 bg-white rounded-xl shadow flex flex-col items-stretch flex-wrap gap-4 w-full">
          {voters ? (
            <div className="flex flex-col divide-y divide-gray-200 w-full items-center">
              {voters.data.map((voter, i) => (
                <Voter
                  key={voter.address}
                  voter={voter}
                  index={i}
                  ensName={ensNames[voter.address]}
                  voterProtocolData={getProtocolVoterData(voter, protocol.data)}
                  totalPowerCast={totalPowerCast}
                />
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default Leaderboard

interface VoterProps {
  voter: VoterInterface
  index: number
  ensName?: string
  totalPowerCast: number
  voterProtocolData: VProtocol
}

const Voter = ({
  voter,
  index,
  ensName,
  totalPowerCast,
  voterProtocolData,
}: VoterProps) => {
  const { totalPowerCast: voterPower } = voterProtocolData
  const powerPercentage = formatPercentage(voterPower / totalPowerCast)
  const votingSince = new Date(voterProtocolData.firstVoteCast * 1000)
  return (
    <div className="w-full p-3 sm:p-5">
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-5 sm:col-span-4 items-center gap-2 grid grid-cols-4">
          <div className="flex items-center gap-2 col-span-3">
            <p className="text-2xl font-light">{index + 1}.</p>
            <div className="rounded-full overflow-hidden bg-gray-400 shadow flex-shrink-0">
              <Blockies seed={voter.address} size={6} />
            </div>
            <div className="text-xl sm:text-3xl tracking-wide font-extralight">
              {ensName ?? formatAddress(voter.address)}
            </div>
          </div>

          <div className="justify-self-end sm:justify-self-center font-light text-sm w-10 h-10 text-gray-100 bg-primary-800 flex items-center justify-center rounded-full flex-shrink-0">
            {powerPercentage}
          </div>
        </div>

        <div className="flex col-span-5 sm:col-span-1 sm:flex-col items-start justify-between sm:justify-start text-xs  gap-2 text-gray-500 tracking-tight leading-none">
          <div className="text-gray-500">
            Last vote: {timeAgo.format(voterProtocolData.lastVoteCast * 1000)}
          </div>

          <div>
            {voterProtocolData.totalVotesCast}{' '}
            {voterProtocolData.totalVotesCast === 1 ? 'vote' : 'votes'}
          </div>

          <div>
            Voting since{' '}
            {votingSince.getMonth() + 1 + '/' + votingSince.getFullYear()}
          </div>
        </div>
      </div>
    </div>
  )
}

const voterLimit = 100

export const getServerSideProps: GetServerSideProps<
  LeaderboardPageProps,
  { cname: string }
> = async (context) => {
  const cname = context.params?.cname
  if (!cname) {
    return {
      notFound: true,
    }
  }

  const initialVotersRequest = getVoters(cname, {
    limit: Number.MAX_SAFE_INTEGER,
  })
  const protocolRequest = getProtocol(cname)

  const [voters, protocol] = await Promise.all([
    initialVotersRequest,
    protocolRequest,
  ])

  const totalPowerCast = voters.data.reduce((total, voter) => {
    const ptcl = voter.protocols.find((p) => p.protocol === protocol.data.cname)
    return total + (ptcl ? ptcl.totalPowerCast : 0)
  }, 0)

  const ensNameArray = await Promise.all(
    voters.data
      .slice(0, 99)
      .map((voter) =>
        resolveEnsName(voter.address).then((name) => ({ voter, name }))
      )
  )
  const ensNames: Record<string, string> = {}

  ensNameArray.forEach(({ voter, name }) => {
    if (name) ensNames[voter.address] = name
  })

  return {
    props: {
      voters,
      protocol,
      ensNames,
      totalPowerCast,
    },
  }
}
