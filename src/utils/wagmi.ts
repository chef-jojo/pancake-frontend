import { ChainId } from '@pancakeswap/sdk'
import { BASE_BSC_SCAN_URLS } from 'config'
import { createClient, configureChains, Chain } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import addresses from 'config/constants/contracts'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const bscExplorer = { name: 'BscScan', url: BASE_BSC_SCAN_URLS[ChainId.MAINNET] }

const bsc: Chain = {
  id: 56,
  name: 'BNB Smart Chain Mainnet',
  network: 'bsc',
  rpcUrls: {
    default: 'https://bsc.nodereal.io',
    public: 'https://bsc.nodereal.io',
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  multicall: {
    address: addresses.multiCall[56],
    blockCreated: 7162653,
  },
  nativeCurrency: {
    name: 'BNB',
    symbol: 'bnb',
    decimals: 18,
  },
}

const bscTest: Chain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
    public: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'BASE_BSC_SCAN_URLS[ChainId.TESTNET]' },
  },
  multicall: {
    address: addresses.multiCall[97],
    blockCreated: 9759845,
  },
  testnet: true,
}

const { provider } = configureChains(
  [bsc, bscTest],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: chain.rpcUrls.default }
      },
    }),
  ],
)

export const client = createClient({
  autoConnect: true,
  provider,
})

export const injectedConnector = new InjectedConnector({
  chains: [bsc, bscTest],
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains: [bsc, bscTest],
  options: {
    appName: 'PancakeSwap',
    appLogoUrl: 'https://pancakeswap.com/logo.png',
    jsonRpcUrl: 'https://bsc.nodereal.io',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains: [bsc, bscTest],
  options: {
    rpc: {
      [bsc.id]: bsc.rpcUrls.default,
      [bscTest.id]: bsc.rpcUrls.default,
    },
    qrcode: true,
  },
})
