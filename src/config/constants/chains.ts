import { ChainId } from '@pancakeswap/sdk'
import type { AddEthereumChainParameter } from '@web3-react/types'
import { BASE_BSC_SCAN_URL, BASE_BSC_SCAN_URLS } from 'config'
import { BSC_PROD_NODE } from 'utils/providers'
import { BSC_RPC_URLS, BSC_TESTNET_RPC_URLS } from './rpc'

// const ETH: AddEthereumChainParameter['nativeCurrency'] = {
//   name: 'Ether',
//   symbol: 'ETH',
//   decimals: 18,
// }

const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'bnb',
  symbol: 'BNB',
  decimals: 18,
}

interface BasicChainInformation {
  urls: string[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  }
  return chainId
}

export const CHAINS: { [chainId: number]: BasicChainInformation | ExtendedChainInformation } = {
  [ChainId.BSC]: {
    name: 'BNB Smart Chain Mainnet',
    blockExplorerUrls: [BASE_BSC_SCAN_URL],
    urls: [BSC_PROD_NODE, ...BSC_RPC_URLS],
    nativeCurrency: BNB,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB Smart Chain Testnet',
    blockExplorerUrls: [BASE_BSC_SCAN_URLS[ChainId.BSC_TESTNET]],
    urls: BSC_TESTNET_RPC_URLS,
    nativeCurrency: BNB,
  },
}

export const isChainSupported = (chainId: number) => chainId && [ChainId.BSC, ChainId.BSC_TESTNET].includes(chainId)

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls

    if (validURLs.length) {
      // eslint-disable-next-line no-param-reassign
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {},
)
