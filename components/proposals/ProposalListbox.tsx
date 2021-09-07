import { Listbox } from '@headlessui/react'
import TimeAgo from 'javascript-time-ago'
import { useRouter } from 'next/dist/client/router'
import { useCallback, useRef } from 'react'

import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiCheck,
} from 'react-icons/hi'
import InfiniteScroll from 'react-infinite-scroll-component'

import { Proposal } from '../../types'

interface ProposalSelectProps {
  proposals: Proposal[]
  selectedProposal: Proposal
  onChange: (proposal: Proposal) => void
  fetchMore: () => void
  hasMore: boolean
}

const ProposalListbox: React.FC<ProposalSelectProps> = ({
  proposals,
  selectedProposal,
  onChange,
  fetchMore,
  hasMore,
}) => {
  const router = useRouter()
  const listboxRef = useRef(null)
  return (
    <div>
      <Listbox
        value={proposals?.find((p) => p.refId === selectedProposal.refId)}
        onChange={onChange}
      >
        <Listbox.Button className="lg:row-start-1 lg:col-span-5">
          <div className="flex items-center justify-start gap-3">
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-tight text-left font-light">
              {selectedProposal.title}
            </h2>
            <HiOutlineChevronDown size="32" />
          </div>
        </Listbox.Button>

        <div className="relative h-0 w-0 z-10 bg-surface rounded-xl ">
          <Listbox.Options
            ref={listboxRef}
            className="max-h-80 w-96 bg-surface p-4 rounded-lg shadow-lg overflow-auto"
          >
            <InfiniteScroll
              dataLength={proposals.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              scrollableTarget={listboxRef}
              scrollThreshold="50%"
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>this is end</b>
                </p>
              }
            >
              {proposals.map((proposal) => (
                <Listbox.Option
                  key={proposal.id}
                  value={proposal}
                  disabled={false}
                  className=""
                >
                  {({ active, selected }) => (
                    <div className="h-full w-full flex flex-col justify-center">
                      {selected ? (
                        <span className="relative pl-3 h-0 top-2">
                          <HiCheck />
                        </span>
                      ) : null}
                      <div
                        className={`pl-10 flex justify-between text-xs py-2 px-3 rounded-lg ${
                          active ? 'bg-purple-200' : ''
                        }`}
                      >
                        <span className="max-w-68 truncate pr-5">
                          {proposal.title}
                        </span>
                        <span className="text-blue-500">
                          {proposal.currentState}
                        </span>
                      </div>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </InfiniteScroll>
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}

export default ProposalListbox
