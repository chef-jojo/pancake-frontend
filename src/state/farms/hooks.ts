import BigNumber from 'bignumber.js'
import { SLOW_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { formatUnits } from 'ethers/lib/utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { BIG_ZERO } from 'utils/bigNumber'
import { getMasterchefContract } from 'utils/contractHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import { ReturnUseMultiCall, useMulticall } from 'utils/multicall'
import { fetchFarmsPublicDataAsync } from '.'
import { DeserializedFarm, DeserializedFarmsState, DeserializedFarmUserData } from '../types'
import fetchFarms from './fetchFarms'
import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from './fetchFarmUser'
import getFarmsPrices from './getFarmsPrices'
import { deserializeFarm, priceCakeFromPidSelector } from './selectors'

export const getFarmFiles = async (chainId: number): Promise<SerializedFarmConfig[]> => {
  try {
    return (await import(`config/constants/farms/${chainId}.ts`)).default
  } catch (error) {
    console.error('Farm config not supported in chain: ', chainId, error)
    return []
  }
}

// @notice: Only BSC
export function useRegularCakePerBlock() {
  return useSWRImmutable('regularCakePerBlock', async () => {
    const mc = getMasterchefContract()
    return +formatUnits(await mc.cakePerBlock(true))
  })
}

export function useFarmsLength() {
  const { chainId } = useActiveWeb3React()
  return useSWRImmutable(chainId ? ['farmsLength', chainId] : null, async () => {
    const mc = getMasterchefContract(undefined, chainId)
    return (await mc.poolLength()).toNumber()
  })
}

const getFarmToFetchByPids = async (
  multicall: ReturnUseMultiCall,
  chainId: number,
  pids: number[],
  poolLength: number,
) => {
  const farmsConfig = await getFarmFiles(chainId)
  const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
  const farmsCanFetch = farmsToFetch.filter((f) => poolLength > f.pid)

  const farms = await fetchFarms(multicall, chainId, farmsCanFetch)
  const farmsWithPrices = getFarmsPrices(farms)

  return farmsWithPrices.map(deserializeFarm)
}

function useFarmsPublicData() {
  const { chainId } = useActiveWeb3React()

  const multicall = useMulticall()
  const { data: poolLength } = useFarmsLength()

  return useSWRImmutable(
    chainId && poolLength ? ['publicFarmData', chainId, poolLength] : null,
    async () => {
      const farmsConfig = await getFarmFiles(chainId)
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)

      return getFarmToFetchByPids(multicall, chainId, pids, poolLength)
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

function useFarmsUserData() {
  const { chainId, account } = useActiveWeb3React()

  const multicall = useMulticall()
  const { data: poolLength } = useFarmsLength()

  return useSWRImmutable(
    chainId && account && poolLength ? ['farmsWithUserData', account, chainId, poolLength] : null,
    async () => {
      const farmsConfig = await getFarmFiles(chainId)
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)
      const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))
      const farmsCanFetch = farmsToFetch.filter((f) => poolLength > f.pid)
      const [userFarmAllowances, userFarmTokenBalances, userStakedBalances, userFarmEarnings] = await Promise.all([
        fetchFarmUserAllowances(multicall, chainId, account, farmsCanFetch),
        fetchFarmUserTokenBalances(multicall, account, farmsCanFetch),
        fetchFarmUserStakedBalances(multicall, chainId, account, farmsCanFetch),
        fetchFarmUserEarnings(multicall, chainId, account, farmsCanFetch),
      ])

      return userFarmAllowances.map((farmAllowance, index) => {
        return {
          pid: farmsCanFetch[index].pid,
          allowance: userFarmAllowances[index],
          tokenBalance: userFarmTokenBalances[index],
          stakedBalance: userStakedBalances[index],
          earnings: userFarmEarnings[index],
        }
      })
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const usePollFarmsWithUserData = () => {
  useFarmsUserData()
  useFarmsPublicData()
}

/**
 * Fetches the "core" farm data used globally
 * 2 = CAKE-BNB LP
 * 3 = BUSD-BNB LP
 */
const coreFarmPIDs = {
  56: [2, 3],
  97: [1, 2],
}

export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  // TODO: multi
  // const { chainId } = useActiveWeb3React()

  useFastRefreshEffect(() => {
    dispatch(fetchFarmsPublicDataAsync(coreFarmPIDs[56]))
  }, [dispatch])
}

export const useFarms = (): DeserializedFarmsState => {
  const { data: publicDatas } = useFarmsPublicData()
  const { data: userDatas } = useFarmsUserData()

  const data = useMemo(() => {
    return (
      publicDatas?.map((d) => {
        const userData = userDatas?.find((u) => u.pid === d.pid) ?? {
          allowance: BIG_ZERO,
          tokenBalance: BIG_ZERO,
          stakedBalance: BIG_ZERO,
          earnings: BIG_ZERO,
        }
        return {
          ...d,
          userData,
        }
      }) ?? []
    )
  }, [publicDatas, userDatas])

  return {
    data,
    userDataLoaded: !!userDatas,
  }
}

export const useFarmFromPid = (pid: number): DeserializedFarm => {
  const { chainId } = useActiveWeb3React()
  const { data: poolLength } = useFarmsLength()
  const multicall = useMulticall()
  const { data } = useSWRImmutable(['farm', pid, chainId], async () => {
    return (await getFarmToFetchByPids(multicall, chainId, [pid], poolLength)).map(deserializeFarm)
  })

  return data?.[0]
}

export const useFarmUser = (pid): DeserializedFarmUserData => {
  const { data: userDatas } = useFarmsUserData()
  return useMemo(
    () =>
      userDatas?.find((u) => u.pid === pid) ?? {
        allowance: BIG_ZERO,
        tokenBalance: BIG_ZERO,
        stakedBalance: BIG_ZERO,
        earnings: BIG_ZERO,
      },
    [pid, userDatas],
  )
}

export const useLpTokenPrice = (symbol: string) => {
  const { data: farms } = useFarmsPublicData()
  const farm = farms.find((f) => f.lpSymbol === symbol)
  let lpTokenPrice = BIG_ZERO

  const lpTotalInQuoteToken = farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO
  const lpTotalSupply = farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO

  if (lpTotalSupply.gt(0) && lpTotalInQuoteToken.gt(0)) {
    const farmTokenPriceInUsd = new BigNumber(farm.tokenPriceBusd)
    const tokenAmountTotal = farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(lpTotalSupply)
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

/**
 * @@deprecated use the BUSD hook in /hooks
 */
export const usePriceCakeBusd = (): BigNumber => {
  return useSelector(priceCakeFromPidSelector)
}
