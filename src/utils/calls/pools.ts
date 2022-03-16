/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js'
import { request, gql } from 'graphql-request'
import poolsConfig from 'config/constants/pools'
import sousChefV2 from 'config/abi/sousChefV2.json'
import { SerializedPoolConfig } from 'config/constants/types'
import multicall from '../multicall'
import { simpleRpcProvider } from '../providers'
import { getAddress } from '../addressHelpers'

const API = 'https://api.thegraph.com/subgraphs/name/chef-jojo/smartchef'

const getSmartChefPoolDataSubgraph = async (pools: SerializedPoolConfig[], blockNumber?: number) => {
  const data = await request(
    API,
    gql`
      query SmartChefQuery($pools: [String!], $blockNumber: Int!) {
        smartChefs(where: { id_in: $pools }, block: { number: $blockNumber }, first: 1000) {
          id
        }
      }
    `,
    {
      pools: pools.map((pool) => getAddress(pool.contractAddress)).map((p) => p.toLowerCase()),
      blockNumber,
    },
  )

  return data?.smartChefs
}

/**
 * Returns the total number of pools that were active at a given block
 */
export const getActivePools = async (block?: number) => {
  const filterKnownFinishedPools = poolsConfig
    .filter((pool) => pool.sousId !== 0)
    .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)

  const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
  const eligiblePools = await getSmartChefPoolDataSubgraph(filterKnownFinishedPools, blockNumber)

  const startBlockCalls = eligiblePools.map(({ id }) => ({
    address: id,
    name: 'startBlock',
  }))
  const endBlockCalls = eligiblePools.map(({ id }) => ({
    address: id,
    name: 'bonusEndBlock',
  }))
  const startBlocks = await multicall(sousChefV2, startBlockCalls)
  const endBlocks = await multicall(sousChefV2, endBlockCalls)

  return eligiblePools.reduce((accum, poolCheck, index) => {
    const startBlock = startBlocks[index] ? new BigNumber(startBlocks[index]) : null
    const endBlock = endBlocks[index] ? new BigNumber(endBlocks[index]) : null

    if (!startBlock || !endBlock) {
      return accum
    }

    if (startBlock.gte(blockNumber) || endBlock.lte(blockNumber)) {
      return accum
    }

    return [...accum, poolCheck]
  }, [])
}
