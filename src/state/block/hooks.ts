import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
// eslint-disable-next-line camelcase
import useSWR, { unstable_serialize, useSWRConfig } from 'swr'
import { simpleRpcProvider } from 'utils/providers'
import useSWRImmutable from 'swr/immutable'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const { cache, mutate } = useSWRConfig()

  const { data } = useSWR(
    ['blockNumber'],
    async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      if (!cache.get(unstable_serialize(['initialBlockNumber']))) {
        mutate(['initialBlockNumber'], blockNumber)
      }
      return blockNumber
    },
    {
      refreshInterval: REFRESH_BLOCK_INTERVAL,
    },
  )

  useSWR(
    data ? [FAST_INTERVAL, 'blockNumber'] : null,
    async () => {
      return data
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWR(
    data ? [SLOW_INTERVAL, 'blockNumber'] : null,
    async () => {
      return data
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useCurrentBlock = (): number => {
  const { data: currentBlock = 0 } = useSWRImmutable(['blockNumber'])
  return currentBlock
}

export const useInitialBlock = (): number => {
  const { data: initialBlock = 0 } = useSWRImmutable(['initialBlockNumber'])
  return initialBlock
}
