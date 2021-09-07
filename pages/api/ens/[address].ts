import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { resolveEnsName } from '../../../utils/ens'

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { address } = req.query
  if (address && typeof address === 'string') {
    const ens = await resolveEnsName(address)
    res.end(JSON.stringify(ens))
  } else res.status(500).end()
}

export default handler
