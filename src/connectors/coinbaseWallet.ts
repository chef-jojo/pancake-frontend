import { ChainId } from '@pancakeswap/sdk'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { URLS } from 'config/constants/chains'

export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: URLS[ChainId.BSC][0],
        appName: 'PancakeSwap',
        appLogoUrl: 'https://pancakeswap.com/logo.png',
      },
    }),
)
