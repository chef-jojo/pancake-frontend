import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

function useSentryUser() {
  const { address: account } = useAccount()
  useEffect(() => {
    if (account) {
      Sentry.setUser({ account })
    }
  }, [account])
}

export default useSentryUser
