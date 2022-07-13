import { CHAIN_ID } from 'config/constants/networks'
import { useWeb3LibraryContext } from 'contexts/WagmiProvider'
import { useAccount, useNetwork } from 'wagmi'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const { chain } = useNetwork()
  const { address, connector } = useAccount()
  const library = useWeb3LibraryContext()

  return { library, chainId: chain?.id ?? parseInt(CHAIN_ID, 10), account: address, connector }
}

export default useActiveWeb3React
