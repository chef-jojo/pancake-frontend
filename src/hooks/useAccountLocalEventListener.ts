import { useEffect } from 'react'
import useLocalDispatch from '../contexts/LocalRedux/useLocalDispatch'
import { resetUserState } from '../state/global/actions'
import useActiveWeb3React from './useActiveWeb3React'
import usePreviousValue from './usePreviousValue'

export const useAccountLocalEventListener = () => {
  const { account, chainId, connector, isActive } = useActiveWeb3React()
  const dispatch = useLocalDispatch()
  const previousIsActive = usePreviousValue(isActive)

  useEffect(() => {
    if (previousIsActive && !isActive) {
      dispatch(resetUserState({ chainId }))
    }
  }, [account, chainId, dispatch, connector, previousIsActive, isActive])
}
