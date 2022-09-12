import { formatUnits } from '@ethersproject/units'
import { fetchCoin, APTOS_COIN } from '../coin'
import { getProvider } from '../provider'

export type FetchBalanceArgs = {
  /** Address or ANS name */
  address: string
  /** Chain id to use for provider */
  networkName?: string
  /** resource type */
  coin?: string
}

export type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: string
}

const coinStoreTypeTag = (type: string) => `0x1::coin::CoinStore<${type}>`

export async function fetchBalance({ address, networkName, coin }: FetchBalanceArgs): Promise<FetchBalanceResult> {
  const provider = getProvider({ networkName })

  const resource = await provider.getAccountResource(address, coinStoreTypeTag(coin || APTOS_COIN))

  const { value } = (resource.data as any).coin

  const { decimals, symbol } = await fetchCoin({ networkName, coin })

  return {
    decimals,
    symbol,
    formatted: formatUnits(value ?? '0', decimals),
    value,
  }
}
