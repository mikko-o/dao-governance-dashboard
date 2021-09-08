import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import Blockies from 'react-blockies'

import {
  getProposal,
  getProposals,
  getProtocol,
  getVoters,
  getVotes,
  nextApiFetcher,
  swrFetcher,
} from '../../api'
import {
  ApiResponse,
  Proposal as ProposalInterface,
  Protocol as ProtocolInterface,
  Vote,
} from '../../types'
import ProposalListbox from '../../components/proposals/ProposalListbox'
import useChartData from '../../hooks/useChartData'
import ProtocolIcon from '../../components/ProtocolIcon'
import Votes from '../../components/Votes'
import Header from '../../components/Header'
import useInfiniteData from '../../hooks/useInfiniteData'
import ReactMarkdown from 'react-markdown'
import useBarChartData from '../../hooks/useBarChartData'
import BarChart from '../../components/BarChart'
import { formatAddress, timeAgo } from '../../utils'
import { resolveEnsName } from '../../utils/ens'

interface ProtocolPageProps {
  protocol: ApiResponse<ProtocolInterface>
  proposals: ApiResponse<ProposalInterface[]>
  proposal: ApiResponse<ProposalInterface>
  votes: ApiResponse<Vote[]>
  proposerEnsName?: string
}

const proposalLimit = 20

const Protocol: NextPage<ProtocolPageProps> = ({
  protocol,
  proposals: initialProposals,
  proposal: initialProposal,
  votes: initialVotes,
  proposerEnsName: initialEnsName,
}) => {
  const router = useRouter()
  const { refId: initialRefId } = router.query
  const [refId, setRefId] = useState(
    initialRefId ?? initialProposals.data[0].refId
  )

  const { data: selectedProposal, error } = useSWR(`/proposals/${refId}`, {
    initialData: initialProposal,
    revalidateOnMount: false,
  })

  const { data: votes } = useSWR(
    `/proposals/${refId}/votes?limit=${selectedProposal?.data.totalVotes ?? 1}`,
    {
      initialData: initialVotes,
      revalidateOnMount: false,
    }
  )

  const totalPowerCast = useMemo(
    () =>
      selectedProposal?.data.results.reduce(
        (sum, choice) => sum + choice.total,
        0
      ),
    [selectedProposal]
  )

  const {
    data: proposals,
    fetchData,
    hasMore,
  } = useInfiniteData(
    `/protocols/${protocol.data.cname}/proposals`,
    proposalLimit,
    initialProposals
  )

  const onProposalChange = useCallback(
    (proposal: ProposalInterface) => {
      if (proposal)
        router.push(
          `/proposals/${protocol.data.cname}?refId=${proposal.refId}`,
          '',
          {
            shallow: true,
          }
        )
      setRefId(proposal.refId)
    },
    [protocol, router]
  )

  const { data: proposerEnsName } = useSWR<string | null>(
    `/api/ens/${selectedProposal?.data.proposer}`,
    nextApiFetcher,
    {
      initialData: initialEnsName,
      revalidateOnMount: false,
    }
  )

  const chartData = useChartData(
    selectedProposal?.data.results,
    selectedProposal?.data.choices
  )

  const { barChartData, keys } = useBarChartData(
    selectedProposal?.data.results,
    selectedProposal?.data.choices,
    votes?.data
  )

  const getCurrentEventTime = useCallback((): string => {
    if (selectedProposal && selectedProposal.data.events.length > 0) {
      const timestamp = selectedProposal.data.events.find(
        (event) => event.event === selectedProposal.data.currentState
      )?.timestamp
      if (timestamp) return timeAgo.format(timestamp * 1000)
      return ''
    }
    return ''
  }, [selectedProposal])

  if (!selectedProposal || !proposals)
    return <div>{protocol} has no proposals yet</div>

  return (
    <div
      id="target"
      className="bg-background w-screen h-screen overflow-auto flex flex-col items-center"
    >
      <Head>
        <title>{protocol.data.name}</title>
        <meta
          name="description"
          content={`DAO governance analytics about ${protocol.data.name} protocol`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <header className="mb-6">
        <div className="p-6 w-screen bg-gray-800 text-gray-300 rounded-b-xl shadow flex gap-6 items-center">
          <div className="text-indigo-300 text-lg">Proposals</div>
          <div className="">
            <Link href={`/leaderboard/${protocol.data.cname}`}>
              <a>Voter leaderboard</a>
            </Link>
          </div>
        </div>
      </header>

      <main className="sm:w-10/12 lg:w-8/12 grid grid-cols-1 gap-6">
        <div className="p-8 bg-white rounded-xl shadow flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ProtocolIcon
              sizePx={42}
              size="large"
              icons={protocol.data.icons}
            />
            <h1 className="text-4xl font-wide font-thin whitespace-nowrap">
              {protocol.data.name}
            </h1>
          </div>

          <div className="bg-white rounded-xl flex gap-2 text-sm">
            <div className="px-2 py-1 border border-gray-300 rounded-2xl text-gray-700 whitespace-nowrap">
              {protocol.data.totalProposals} Proposals
            </div>

            <div className="px-2 py-1 border border-gray-300 rounded-2xl text-gray-700 whitespace-nowrap">
              {protocol.data.totalVotes} Votes
            </div>

            <div className="px-2 py-1 border border-gray-300 rounded-2xl text-gray-700 whitespace-nowrap">
              {protocol.data.uniqueVoters} Voters
            </div>
          </div>
        </div>

        <div className="p-8 bg-white rounded-xl shadow flex flex-col gap-2">
          <h2 className="text-gray-500"> Proposal </h2>
          <div className="flex flex-wrap items-center justify-between lg:grid-rows-1 lg:grid-cols-6 gap-1 ">
            <ProposalListbox
              proposals={proposals}
              selectedProposal={selectedProposal.data}
              onChange={onProposalChange}
              fetchMore={fetchData}
              hasMore={hasMore}
            />

            <div className="flex gap-2">
              <div className="flex tracking-tight text-sm items-center gap-1 py-1 px-2 rounded-xl border border-gray-400 whitespace-nowrap">
                <p className="">{selectedProposal.data.currentState}</p>
                <p className="">{getCurrentEventTime()}</p>
              </div>

              <div className="tracking-tight text-sm py-1 px-2 rounded-xl border border-gray-400 whitespace-nowrap">
                {selectedProposal.data.totalVotes} Votes
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="rounded-full overflow-hidden bg-gray-400 shadow">
              <Blockies seed={selectedProposal.data.proposer} size={6} />
            </div>
            <div>
              {proposerEnsName ?? formatAddress(selectedProposal.data.proposer)}
            </div>
          </div>
        </div>

        <div className="p-8 bg-white rounded-xl shadow flex justify-center items-stretch">
          {chartData && chartData.length > 0 ? (
            <div className="w-[500px] h-[300px] flex flex-col items-center justify-center">
              <BarChart
                data={barChartData}
                keys={keys}
                totalPowerCast={totalPowerCast}
              />
            </div>
          ) : (
            <p className="text-gray-500">No voting results</p>
          )}
        </div>

        <div className="p-8 bg-white rounded-xl shadow flex justify-center">
          <p className="text-[0.6rem] sm:text-sm md:text-md prose lg:prose-lg lg:whitespace-pre-line text-xs leading-relaxed">
            <ReactMarkdown>{selectedProposal.data.content}</ReactMarkdown>
          </p>
        </div>

        <div className="p-8 bg-white rounded-xl shadow">
          <Votes
            totalPower={totalPowerCast}
            votes={votes}
            proposal={selectedProposal.data}
            scrollableTarget="target"
          />
        </div>
      </main>

      <footer></footer>
    </div>
  )
}

export default Protocol

export const getServerSideProps: GetServerSideProps<
  ProtocolPageProps,
  { cname: string }
> = async (context) => {
  const refId = context.query.refId
  const cname = context.params?.cname
  if (!cname) {
    return {
      notFound: true,
    }
  }

  const protocolRequest = getProtocol(cname)
  const proposalsRequest = getProposals(cname, { limit: 10 })
  const proposalRequest = typeof refId === 'string' ? getProposal(refId) : null
  try {
    const [protocol, proposals, proposalFromRef] = await Promise.all([
      protocolRequest,
      proposalsRequest,
      proposalRequest,
    ])
    const proposal = proposalFromRef ?? { data: proposals.data[0] }
    const votesRequest = getVotes({ refId: proposal.data.refId }, { limit: 10 })
    const ensNameRequest = resolveEnsName(proposal.data.proposer)
    const [votes, proposerEnsName] = await Promise.all([
      votesRequest,
      ensNameRequest,
    ])
    return {
      props: {
        protocol,
        proposals,
        proposal,
        votes,
        proposerEnsName,
      },
    }
  } catch (e) {
    console.log(e)
    return {
      notFound: true,
    }
  }
}
