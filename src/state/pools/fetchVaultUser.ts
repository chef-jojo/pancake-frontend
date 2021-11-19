import BigNumber from 'bignumber.js'
import { getCakeVaultContract, getCakeVaultV2Contract } from 'utils/contractHelpers'

const cakeVaultContract = getCakeVaultContract()
const cakeVaultV2Contract = getCakeVaultV2Contract()

const fetchVaultUser = async (account: string, version = 1) => {
  try {
    const userContractResponse = await (version === 2 ? cakeVaultV2Contract : cakeVaultContract).userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser
