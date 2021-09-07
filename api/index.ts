import axios from 'axios'
import {
  ApiResponse,
  PlatformStats,
  Proposal,
  Protocol,
  QueryOptions,
  Vote,
  Voter,
} from '../types'
import queryString from 'query-string'
import { isQueryOptions } from '../utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const get = <T>(uri: string, params?: QueryOptions): Promise<ApiResponse<T>> =>
  axios
    .get<ApiResponse<T>>(
      API_URL + uri + (params ? '?' + queryString.stringify(params) : '')
    )
    .then((res) => res.data)

export const swrFetcher = <T>(uri: string): Promise<ApiResponse<T>> =>
  axios.get<ApiResponse<T>>(API_URL + uri).then((res) => res.data)

export const nextApiFetcher = <T = any>(uri: string) =>
  axios.get<T>(uri).then((res) => res.data)

// Protocols
export const getProtocols = (options?: QueryOptions) =>
  get<Protocol[]>('/protocols', options)
export const getProtocol = (cname: string) =>
  get<Protocol>(`/protocols/${cname}`)

// Proposals
export function getProposals(
  options?: QueryOptions
): Promise<ApiResponse<Proposal[]>>
export function getProposals(
  cname: string,
  options?: QueryOptions
): Promise<ApiResponse<Proposal[]>>
export function getProposals(
  cnameOrOptions?: string | QueryOptions,
  options?: QueryOptions
): Promise<ApiResponse<Proposal[]>> {
  if (typeof cnameOrOptions === 'string') {
    const cname = cnameOrOptions
    return get<Proposal[]>(`/protocols/${cname}/proposals`, options)
  }
  return get<Proposal[]>('/proposals', cnameOrOptions)
}

export const getProposal = (refId: string) =>
  get<Proposal>(`/proposals/${refId}`)

// Votes
type GetVotesParam = { refId: string } | { address: string }
export const getVotes = (param: GetVotesParam, options?: QueryOptions) => {
  if ('refId' in param)
    return get<Vote[]>(`/proposals/${param.refId}/votes`, options)
  else return get<Vote[]>(`/voters/${param.address}/votes`, options)
}

// Voters
export function getVoters(
  cname: string,
  options?: QueryOptions
): Promise<ApiResponse<Voter[]>>
export function getVoters(options?: QueryOptions): Promise<ApiResponse<Voter[]>>
export function getVoters(
  cnameOrOptions?: string | QueryOptions,
  options?: QueryOptions
): Promise<ApiResponse<Voter[]>> {
  if (typeof cnameOrOptions === 'string')
    return get<Voter[]>(`/protocols/${cnameOrOptions}/voters`, options)
  else return get<Voter[]>('/voters', cnameOrOptions)
}

export function getVoter(
  address: string,
  options?: QueryOptions
): Promise<ApiResponse<Voter>> {
  return get<Voter>(`/voters/${address}`, options)
}

// Platform stats
export const getStats = () => get<PlatformStats>('/stats')
