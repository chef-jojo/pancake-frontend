import { useMemo } from 'react'
import { useSigner } from 'wagmi'
import { ChainId, GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { GELATO_HANDLER } from 'config/constants/exchange'

const useGelatoLimitOrdersLib = (): GelatoLimitOrders | undefined => {
  const { chainId, library } = useActiveWeb3React()
  const { data } = useSigner()

  return useMemo(() => {
    if (!chainId || !library) {
      console.error('Could not instantiate GelatoLimitOrders: missing chainId or library')
      return undefined
    }
    try {
      return new GelatoLimitOrders(chainId as ChainId, data, GELATO_HANDLER, false)
    } catch (error: any) {
      console.error(`Could not instantiate GelatoLimitOrders: ${error.message}`)
      return undefined
    }
  }, [chainId, data, library])
}

export default useGelatoLimitOrdersLib
