import Image from 'next/image'
import Link from 'next/link'
import { Protocol } from '../types'
import ProtocolIcon from './ProtocolIcon'

interface ProtocolCardProps {
  protocol: Protocol
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol }) => {
  const { icons, tokens, name, totalProposals, totalVotes, uniqueVoters } =
    protocol

  return (
    <div className="bg-surface h-full rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col justify-between w-full h-full">
        <div className="p-4 flex items-center gap-3">
          {/* Image */}
          <div className="">
            <ProtocolIcon size="large" sizePx="32" icons={icons} />
          </div>

          {/* Name */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              <a href={`/proposals/${protocol.cname}`}>{name}</a>
            </h1>

            {/* Symbol */}
            {tokens
              ? tokens.map((token) => (
                  <p
                    key={token.symbol}
                    className="text-gray-700 text-sm tracking-wide"
                  >
                    <span className="text-primary-700 uppercase font-semibold font-mono">
                      {token.network === 'ethereum' ? (
                        <a
                          href={`https://etherscan.io/token/${token.contractAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {token.symbol}
                        </a>
                      ) : (
                        <span>{token.symbol}</span>
                      )}
                    </span>
                    : {token.marketPrices[0].price}
                    <span className="pl-1 uppercase text-xs align-text-top tracking-tight">
                      {token.marketPrices[0].currency}
                    </span>
                  </p>
                ))
              : ''}
          </div>
        </div>

        {/* Proposals, votes, voters */}
        <div className="p-4 bg-gray-50 flex flex-wrap items-center content-center text-xs gap-2 mt-2">
          <div className="px-2 py-1 border border-gray-300 hover:border-blue-400 rounded-2xl text-gray-700 whitespace-nowrap">
            {totalProposals}
            <Link href={`/proposals/${protocol.cname}`}>
              <a className="text-blue-400 pl-1">Proposals</a>
            </Link>
          </div>

          <div className="px-2 py-1 border border-gray-300 rounded-2xl text-gray-700 whitespace-nowrap">
            {totalVotes} Votes
          </div>

          <div className="px-2 py-1 border border-gray-300 hover:border-blue-400 rounded-2xl text-gray-700 whitespace-nowrap">
            {uniqueVoters}
            <Link href={`/leaderboard/${protocol.cname}`}>
              <a className="text-blue-400 pl-1">Voters</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProtocolCard
