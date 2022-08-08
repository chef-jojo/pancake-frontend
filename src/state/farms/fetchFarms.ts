import BigNumber from 'bignumber.js'
import { SerializedFarmConfig } from 'config/constants/types'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'
import { ReturnUseMultiCall } from 'utils/multicall'
import { BIG_TWO, BIG_ZERO } from '../../utils/bigNumber'
import { SerializedFarm } from '../types'
import { fetchMasterChefData } from './fetchMasterChefData'
import { fetchPublicFarmsData } from './fetchPublicFarmData'

const fetchFarms = async (
  multicall: ReturnUseMultiCall,
  chainId: number,
  farmsToFetch: SerializedFarmConfig[],
): Promise<SerializedFarm[]> => {
  const [farmResult, masterChefResult] = await Promise.all([
    fetchPublicFarmsData(multicall, chainId, farmsToFetch),
    fetchMasterChefData(multicall, chainId, farmsToFetch),
  ])

  return farmsToFetch.map((farm, index) => {
    const [
      tokenBalanceLP,
      quoteTokenBalanceLP,
      lpTokenBalanceMC,
      lpTotalSupply,
      [tokenDecimals],
      [quoteTokenDecimals],
    ] = farmResult[index]

    const [info, totalRegularAllocPoint] = masterChefResult[index]

    const lpTotalSupplyBN = new BigNumber(lpTotalSupply)

    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(lpTotalSupplyBN)

    // Raw amount of token in the LP, including those not staked
    const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(getFullDecimalMultiplier(tokenDecimals))
    const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(getFullDecimalMultiplier(quoteTokenDecimals))

    // Amount of quoteToken in the LP that are staked in the MC
    const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

    // Total staked in LP, in quote token value
    const lpTotalInQuoteToken = quoteTokenAmountMc.times(BIG_TWO)

    const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    const poolWeight = totalRegularAllocPoint ? allocPoint.div(new BigNumber(totalRegularAllocPoint)) : BIG_ZERO

    return {
      ...farm,
      token: farm.token,
      quoteToken: farm.quoteToken,
      tokenAmountTotal,
      quoteTokenAmountTotal,
      lpTotalSupply,
      lpTotalInQuoteToken,
      tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal),
      poolWeight,
      multiplier: `${allocPoint.div(100).toString()}X`,
    }
  })
}

export default fetchFarms
