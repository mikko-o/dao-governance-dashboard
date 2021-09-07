import TimeAgo from 'javascript-time-ago'
import Link from 'next/link'
import { Proposal as ProposalInterface, Protocol } from '../../types'
import ProtocolIcon from '../ProtocolIcon'

interface ProposalProps {
  proposal: ProposalInterface
  protocol: Protocol
}

const timeAgo = new TimeAgo()

const ProposalCompact: React.FC<ProposalProps> = ({ proposal, protocol }) => {
  const { title, content, currentState, results, choices, refId } = proposal
  const { name, icons } = protocol
  return (
    <div>
      <div className="flex w-full justify-between">
        <h1 className="text-md text-primary-500">
          <Link
            href={`/proposals/${proposal.protocol}?refId=${proposal.refId}`}
          >
            <a>{title}</a>
          </Link>
        </h1>
        <div>{currentState}</div>
      </div>

      <div className="flex gap-2">
        <ProtocolIcon size="small" sizePx="26" icons={icons} />
        <h2 className="text-sm">{name}</h2>
      </div>
      <div>starts {timeAgo.format(proposal.startTimestamp * 1000)}</div>
    </div>
  )
}

export default ProposalCompact
