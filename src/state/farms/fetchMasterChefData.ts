import masterchefABI from 'config/abi/masterchef.json'
import chunk from 'lodash/chunk'
import { ReturnUseMultiCall } from 'utils/multicall'
import { SerializedFarmConfig } from '../../config/constants/types'
import { getMasterChefAddress } from '../../utils/addressHelpers'
import { SerializedFarm } from '../types'

const masterChefFarmCalls = (masterChefAddress: string, farm: SerializedFarm) => {
  const { pid } = farm
  return pid || pid === 0
    ? [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [pid],
        },
        {
          address: masterChefAddress,
          name: 'totalRegularAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchMasterChefData = async (
  multicall: ReturnUseMultiCall,
  chainId: number,
  farms: SerializedFarmConfig[],
): Promise<any[]> => {
  const masterChefAddress = getMasterChefAddress(chainId)
  const masterChefCalls = farms.map((farm) => masterChefFarmCalls(masterChefAddress, farm))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()
  const masterChefMultiCallResult = await multicall(masterchefABI, masterChefAggregatedCalls)
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)
  let masterChefChunkedResultCounter = 0
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null]
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
    masterChefChunkedResultCounter++
    return data
  })
}
