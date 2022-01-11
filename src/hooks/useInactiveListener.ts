import { useEffect } from 'react'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import useActiveWeb3React from './useActiveWeb3React'

export const useInactiveListener = () => {
  const { account, chainId, connector } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleDeactivate = () => {
        clearUserStates(dispatch, chainId)
      }

      connector.addListener('Web3ReactDeactivate', handleDeactivate)

      return () => {
        connector.removeListener('Web3ReactDeactivate', handleDeactivate)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
