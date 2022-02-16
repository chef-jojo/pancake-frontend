import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { DependencyList, EffectCallback, useEffect } from 'react'
import useSWR from 'swr'
import noop from 'lodash/noop'
import { EMPTY_ARRAY } from 'utils/constantObjects'

type BlockEffectCallback = (blockNumber: number) => ReturnType<EffectCallback>

export function useFastRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([FAST_INTERVAL, 'blockNumber'])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(data ? effect.bind(null, data) : noop, [data, ...(deps || EMPTY_ARRAY)])
}

export function useSlowRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([SLOW_INTERVAL, 'blockNumber'])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(data ? effect.bind(null, data) : noop, [data, ...(deps || EMPTY_ARRAY)])
}
