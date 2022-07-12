import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'

export const useCanClaimSpecialNFT = () => {
  const profileApiUrl = process.env.NEXT_PUBLIC_API_PROFILE
  const { address: account } = useAccount()
  const [canClaimSpecialNFT, setCanClaimSpecialNFT] = useState(false)
  useEffect(() => {
    const fetchUserTradingStats = async () => {
      const res = await fetch(`${profileApiUrl}/api/users/${account}`)
      const data = await res.json()
      if (parseInt(data?.leaderboard_dar?.darVolumeRank ?? '101') <= 100) setCanClaimSpecialNFT(true)
    }
    // If user has not registered, user trading information will not be displayed and should not be fetched
    if (account) {
      fetchUserTradingStats()
    }
  }, [account, profileApiUrl])
  return canClaimSpecialNFT
}
