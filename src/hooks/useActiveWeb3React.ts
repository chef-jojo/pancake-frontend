import { Web3Provider } from '@ethersproject/providers'
import { CHAIN_ID } from 'config/constants/networks'
import { useWeb3LibraryContext } from 'contexts/WagmiProvider'
import { useAccount, useNetwork, useProvider } from 'wagmi'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const { chain } = useNetwork()
  const { address, connector } = useAccount()
  const library = useWeb3LibraryContext()
  const provider = useProvider()

  return {
    library: (library || provider) as Web3Provider,
    chainId: chain?.id ?? parseInt(CHAIN_ID, 10),
    account: address,
    connector,
  }
}

export default useActiveWeb3React
