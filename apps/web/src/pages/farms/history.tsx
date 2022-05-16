import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import { FarmsPageLayout, FarmsContext } from '@/views/Farms'
import FarmCard from '@/views/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from '@/views/Farms/Farms'
import { usePriceCakeBusd } from '@/state/farms/hooks'

const FarmsHistoryPage = () => {
  const { account } = useWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  const cakePrice = usePriceCakeBusd()

  return (
    <>
      {chosenFarmsMemoized.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
          cakePrice={cakePrice}
          account={account}
          removed
        />
      ))}
    </>
  )
}

FarmsHistoryPage.Layout = FarmsPageLayout

export default FarmsHistoryPage
