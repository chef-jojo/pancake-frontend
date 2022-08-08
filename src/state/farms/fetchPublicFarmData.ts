import erc20 from 'config/abi/erc20.json'
import chunk from 'lodash/chunk'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { ReturnUseMultiCall } from 'utils/multicall'
import { SerializedFarmConfig } from '../../config/constants/types'
import { SerializedFarm } from '../types'

const fetchFarmCalls = (masterChefAddress: string, farm: SerializedFarm) => {
  const { lpAddresses, token, quoteToken } = farm
  const lpAddress = getAddress(lpAddresses)
  return [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: token.address,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: quoteToken.address,
      name: 'decimals',
    },
  ]
}

export const fetchPublicFarmsData = async (
  multicall: ReturnUseMultiCall,
  chainId: number,
  farms: SerializedFarmConfig[],
): Promise<any[]> => {
  const masterChefAddress = getMasterChefAddress(chainId)
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(masterChefAddress, farm))
  const chunkSize = farmCalls.length / farms.length
  const farmMultiCallResult = await multicall(erc20, farmCalls)
  return chunk(farmMultiCallResult, chunkSize)
}
