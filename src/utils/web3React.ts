import { Connector } from 'wagmi'
import { hexlify } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'
import { BscConnector } from './connectors/bscConnector'

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (
  connector: Connector,
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
