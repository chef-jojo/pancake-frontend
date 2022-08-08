import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import { SerializedFarmConfig } from 'config/constants/types'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { ReturnUseMultiCall } from 'utils/multicall'

export const fetchFarmUserAllowances = async (
  multi: ReturnUseMultiCall,
  chainId: number,
  account: string,
  farmsToFetch: SerializedFarmConfig[],
) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAddress] }
  })

  const rawLpAllowances = await multi<BigNumber[]>(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance)
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (
  multi: ReturnUseMultiCall,
  account: string,
  farmsToFetch: SerializedFarmConfig[],
) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multi(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance)
  })
  return parsedTokenBalances as BigNumber[]
}

export const fetchFarmUserStakedBalances = async (
  multi: ReturnUseMultiCall,
  chainId: number,
  account: string,
  farmsToFetch: SerializedFarmConfig[],
) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multi(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex)
  })
  return parsedStakedBalances as BigNumber[]
}

export const fetchFarmUserEarnings = async (
  multi: ReturnUseMultiCall,
  chainId: number,
  account: string,
  farmsToFetch: SerializedFarmConfig[],
) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'pendingCake',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multi(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings)
  })
  return parsedEarnings as BigNumber[]
}
