import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(
  process.env.JSON_RPC_PROVIDER
)

export const resolveEnsName = (name: string) => provider.lookupAddress(name)
