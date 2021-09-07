import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { getVoter, getVotes } from '../../api'
import { ApiResponse, Vote, Voter } from '../../types'

interface AccountPageProps {
  voter: ApiResponse<Voter>
  votes: ApiResponse<Vote[]>
}

const Account: NextPage<AccountPageProps> = ({ voter, votes }) => {
  const { totalVotesCast, firstVoteCast, lastVoteCast, address, protocols } =
    voter.data
  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main></main>
    </div>
  )
}

export default Account

export const getServerSideProps: GetServerSideProps<
  AccountPageProps,
  { address: string }
> = async (context) => {
  const address = context.params?.address
  if (!address) return { notFound: true }
  const [voter, votes] = await Promise.all([
    getVoter(address),
    getVotes({ address }),
  ])
  return {
    props: {
      voter,
      votes,
    },
  }
}
