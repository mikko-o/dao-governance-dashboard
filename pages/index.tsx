import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import orderBy from 'lodash.orderby'
import {
  ApiResponse,
  PlatformStats,
  Proposal as ProposalInterface,
  Protocol,
  Vote,
  Voter,
} from '../types'
import { getProposals, getProtocols, getStats, getVoters } from '../api'
import ProtocolCard from '../components/ProtocolCard'
import { useState } from 'react'
import useGetProtocol from '../hooks/useGetProtocol'
import Header from '../components/Header'
import RecentVotes from '../components/RecentVotes'

interface HomeProps {
  protocols: ApiResponse<Protocol[]>
  stats: ApiResponse<PlatformStats>
  recentVoters: ApiResponse<Voter[]>
}

type OrderBy = 'name' | 'totalProposals' | 'totalVotes' | 'uniqueVoters'
type OrderDirection = 'asc' | 'desc'
const getOrderDirection = (orderBy: OrderBy): OrderDirection => {
  switch (orderBy) {
    case 'name':
      return 'asc'
    default:
      return 'desc'
  }
}

const Home: NextPage<HomeProps> = ({
  protocols,
  stats,
  recentVoters,
}: HomeProps) => {
  const [order, setOrder] = useState<OrderBy>('name')

  const getProtocol = useGetProtocol(protocols.data)

  if (!protocols) return null
  return (
    <div id="target" className="bg-background w-screen h-screen overflow-auto">
      <Head>
        <title>Broadroom Dashboard</title>
        <meta
          name="description"
          content="A DAO Governance Analytics Dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header page="home" />

      <main className="w-full h-full flex flex-col items-center my-5">
        <div className="p-6 bg-white shadow rounded-lg">
          <RecentVotes
            initialLatestVoters={recentVoters}
            getProtocol={getProtocol}
          />
        </div>
        <div className="m-4 flex flex-col space-y-3 w-10/12">
          <div className="self-end mr-16 flex items-center">
            <p className="font-bold text-sm text-gray-500 pr-1">Order: </p>
            <select
              className="text-gray-700 focus:outline-none border-none rounded-lg bg-background"
              onChange={(e) => {
                const v = e.target.value
                if (
                  v === 'name' ||
                  v === 'totalProposals' ||
                  v === 'totalVotes' ||
                  v == 'uniqueVoters'
                )
                  setOrder(v)
              }}
            >
              <option value="name">Name</option>
              <option value="totalProposals">Total Proposals</option>
              <option value="totalVotes">Total Votes</option>
              <option value="uniqueVoters">Total Voters</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-center gap-4">
            {orderBy(protocols.data, [order], [getOrderDirection(order)]).map(
              (protocol) => (
                <ProtocolCard key={protocol.cname} protocol={protocol} />
              )
            )}
          </div>
        </div>
      </main>

      <footer className="h-20"></footer>
    </div>
  )
}

export default Home

const recentVotersLimit = 9

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const protocolsRequest = getProtocols({ limit: 10000 })
  const statsRequest = getStats()
  const recentVotersRequest = getVoters({ limit: recentVotersLimit })
  try {
    const [protocols, stats, recentVoters] = await Promise.all<
      ApiResponse<Protocol[]>,
      ApiResponse<PlatformStats>,
      ApiResponse<Voter[]>
    >([protocolsRequest, statsRequest, recentVotersRequest])

    return {
      props: {
        protocols,
        stats,
        recentVoters,
      },
    }
  } catch (e) {
    console.log(e)
    return {
      notFound: true,
    }
  }
}
