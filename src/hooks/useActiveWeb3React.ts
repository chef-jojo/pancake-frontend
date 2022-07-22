import { ChainId } from '@pancakeswap/sdk'
import { useWeb3React } from '@web3-react/core'
import { bscRpcProvider } from 'utils/providers'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): ReturnType<typeof useWeb3React> & { library: any } => {
  const { provider, chainId, ...web3React } = useWeb3React()

  return { library: provider ?? bscRpcProvider, chainId: chainId ?? ChainId.BSC, ...web3React, provider }
}

export default useActiveWeb3React
