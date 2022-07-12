import { useNetwork, useConnect, useProvider } from 'wagmi'
import { simpleRpcProvider } from 'utils/providers'
// eslint-disable-next-line import/no-unresolved
import { CHAIN_ID } from 'config/constants/networks'
import { getLibrary } from 'utils/web3React'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const { chain } = useNetwork()
  const { data } = useConnect()
  // const { connector } = useClient()
  const provider = useProvider()
  // console.log(provider, 'aaa')
  // const library = provider ? getLibrary(provider) : null
  const library = provider as any
  // const { library, chainId, ...web3React } = useWeb3React()

  return { library, chainId: chain?.id ?? parseInt(CHAIN_ID, 10), ...data }
}

export default useActiveWeb3React
