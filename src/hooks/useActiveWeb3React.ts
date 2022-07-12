import { useNetwork, useConnect, useProvider } from 'wagmi'
import { CHAIN_ID } from 'config/constants/networks'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const { chain } = useNetwork()
  const { data } = useConnect()
  const provider = useProvider()
  const library = provider as any

  return { library, chainId: chain?.id ?? parseInt(CHAIN_ID, 10), ...data }
}

export default useActiveWeb3React
