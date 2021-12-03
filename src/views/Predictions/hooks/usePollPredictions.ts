import { useWeb3React } from '@web3-react/core'
import useInterval from 'hooks/useInterval'
import { range } from 'lodash'
import { batch } from 'react-redux'
import { useAppDispatch } from 'state'
import { fetchClaimableStatuses, fetchLedgerData, fetchMarketData, fetchRounds } from 'state/predictions'
import { useGetCurrentEpoch, useGetEarliestEpoch, useGetPredictionsStatus } from 'state/predictions/hooks'
import { PredictionStatus } from 'state/types'

const POLL_TIME_IN_SECONDS = 10

const usePollPredictions = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const currentEpoch = useGetCurrentEpoch()
  const earliestEpoch = useGetEarliestEpoch()
  const status = useGetPredictionsStatus()

  useInterval(
    () => {
      const liveCurrentAndRecent = [currentEpoch, currentEpoch - 1, currentEpoch - 2]

      batch(() => {
        dispatch(fetchRounds(liveCurrentAndRecent))
        dispatch(fetchMarketData())
      })

      if (account) {
        const epochRange = range(earliestEpoch, currentEpoch + 1)
        batch(() => {
          dispatch(fetchLedgerData({ account, epochs: epochRange }))
          dispatch(fetchClaimableStatuses({ account, epochs: epochRange }))
        })
      }
    },
    status !== PredictionStatus.INITIAL ? POLL_TIME_IN_SECONDS * 1000 : null,
  )
}

export default usePollPredictions
