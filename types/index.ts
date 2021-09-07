export interface ApiResponse<T> {
  data: T
  nextCursor?: string
}

export interface QueryOptions {
  limit?: number
  cursor?: number
}

export interface ChartItem {
  id: string
  label: string
  value: number
  color?: string
}

export interface BarItem {
  choice: string
  [item: string]: string | number
}

export interface LineChartItem {
  id: string | number
  data: Array<{
    x: number | string | Date
    y: number
  }>
}

// Protocol
export interface Protocol {
  icons?: Icon[]
  tokens: Token[]
  cname: string
  name: string
  totalProposals: number
  totalVotes: number
  uniqueVoters: number
}

export type IconSize = 'thumb' | 'small' | 'large'

export interface Icon {
  adapter: string
  size: IconSize
  url: string
}

interface Price {
  currency: string
  price: number
}

interface Token {
  network: string
  contractAddress: string
  marketPrices: Price[]
  adapter: string
  symbol: string
}

// Proposal
export interface Proposal {
  startTimestamp: number
  endTimestamp: number
  title: string
  content: string
  protocol: string
  adapter: string
  startTime: Block
  id: string
  currentState: string
  results: Result[]
  choices: string[]
  events: Event[]
  refId: string
  proposer: string
  totalVotes: number
  blockNumber: number
  externalUrl: string
  endTime: Block
}

interface Block {
  blockNumber: number
}

export interface Result {
  total: number
  choice: number
}

interface Event {
  timestamp: number
  time: Block
  event: string
}

// Voter
export interface Voter {
  address: string
  firstVoteCast: number
  lastVoteCast: number
  totalVotesCast: number
  protocols: VProtocol[]
}

export interface VProtocol {
  lastCastPower: number
  protocol: string
  totalVotesCast: number
  lastVoteCast: number
  firstVoteCast: number
  totalPowerCast: number
}

// Vote
export interface Vote {
  protocol: string
  proposalInfo: ProposalInfo
  adapter: string
  address: string
  refId: string
  proposalRefId: string
  power: number
  time: VTime
  choice: number
  proposalId: number
  timestamp: number
}

interface VTime {
  timestamp: number
}

interface ProposalInfo {
  startTime: VTime
  endTime: VTime
  title: string
  choices: string[]
  currentState: string
  endTimestamp: number
  startTimestamp: number
  events: string[]
}

// Platform Stats
export interface PlatformStats {
  totalProposals: number
  totalProtocols: number
  totalUniqueVoters: number
  totalVotesCast: number
}
