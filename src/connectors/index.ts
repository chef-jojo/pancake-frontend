import { Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { coinbaseWallet, coinbaseWalletHooks } from './coinbaseWallet'
import { metamask, metamaskHooks } from './metamask'
import { network, networkHooks } from './network'
import { walletConnect, walletConnectHooks } from './walletConnect'

export const connectors: [Connector, Web3ReactHooks][] = [
  [metamask, metamaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
]
