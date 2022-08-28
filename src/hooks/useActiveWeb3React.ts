import { useWeb3React } from '@pancakeswap/wagmi'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { useRouter } from 'next/router'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { useProvider } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { queryChainIdAtom, useActiveChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useNetworkConnectorUpdater() {
  const { chainId, isConnecting } = useActiveWeb3React()
  const [loading] = useSwitchNetworkLoading()
  const queryChainId = useAtomValue(queryChainIdAtom)

  useEffect(() => {
    if (loading || isConnecting) return
    const parsedQueryChainId = Number(queryChainId)
    if (!parsedQueryChainId && chainId === ChainId.BSC) return
    if (parsedQueryChainId !== chainId && isChainSupported(chainId)) {
      replaceBrowserHistory('chainId', chainId === ChainId.BSC ? null : chainId)
    }
  }, [chainId, isConnecting, loading, queryChainId])
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const web3React = useWeb3React()
  const { chainId, isWrongNetwork } = useActiveChainId()
  const provider = useProvider({ chainId })

  return {
    provider,
    ...web3React,
    chainId,
    isWrongNetwork,
  }
}

export default useActiveWeb3React
