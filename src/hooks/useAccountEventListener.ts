import { useEffect } from 'react'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import useActiveWeb3React from './useActiveWeb3React'
import usePreviousValue from './usePreviousValue'

export const useAccountEventListener = () => {
  const { account, chainId, connector, isActive } = useActiveWeb3React()
  const previousIsActive = usePreviousValue(isActive)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (previousIsActive && !isActive) {
      clearUserStates(dispatch, chainId)
    }
  }, [account, chainId, dispatch, connector, previousIsActive, isActive])
}
