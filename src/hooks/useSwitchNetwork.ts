import { useCallback } from 'react'
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const [, setSessionChainId] = useSessionChainId()
  const {
    switchNetworkAsync: _switchNetworkAsync,
    isLoading: _isLoading,
    switchNetwork: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchNetworkWallet()
  const { isConnected } = useAccount()

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected) {
        if (typeof _switchNetworkAsync === 'function') {
          setLoading(true)
          return _switchNetworkAsync(chainId).finally(() => setLoading(false))
        }
        return undefined
      }
      return new Promise(() => {
        setSessionChainId(chainId)
      })
    },
    [isConnected, setLoading, setSessionChainId, _switchNetworkAsync],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected) {
        if (typeof _switchNetwork === 'function') {
          return _switchNetwork(chainId)
        }
        return undefined
      }
      return () => {
        setSessionChainId(chainId)
      }
    },
    [_switchNetwork, isConnected, setSessionChainId],
  )

  const isLoading = _isLoading || loading
  const canSwitch = isConnected
    ? !!_switchNetworkAsync &&
      !(
        typeof window !== 'undefined' &&
        // @ts-ignore // TODO: add type later
        window.ethereum?.isSafePal
      )
    : true

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
