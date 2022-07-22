import { BscConnector } from '@binance-chain/bsc-connector'
import { hexlify } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'
import { ConnectorNames } from '@pancakeswap/uikit'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { coinbaseWallet } from '../connectors/coinbaseWallet'
import { metamask } from '../connectors/metamask'
import { walletConnect } from '../connectors/walletConnect'

export const connectorsByName = {
  [ConnectorNames.Injected]: metamask,
  [ConnectorNames.WalletConnect]: walletConnect,
  [ConnectorNames.BSC]: metamask,
  [ConnectorNames.Blocto]: metamask,
  [ConnectorNames.WalletLink]: coinbaseWallet,
} as const

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (
  connector: AbstractConnector,
  provider: any,
  account: string,
  message: string,
): Promise<string> => {
  if (window.BinanceChain && connector instanceof BscConnector) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (provider.provider?.wc) {
    const wcMessage = hexlify(toUtf8Bytes(message))
    const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
    return signature
  }

  return provider.getSigner(account).signMessage(message)
}
