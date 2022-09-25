import { chains, defaultChain } from 'config/chains'
import { useNetwork } from '@pancakeswap/awgmi'
import { atom, useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { isChainSupported } from 'utils'
import { useMemo } from 'react'
import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'

const sessionNetworkAtom = atom<string>('')

export const useSessionNetwork = () => useAtom(sessionNetworkAtom)

const queryNetworkAtom = atom('')

queryNetworkAtom.onMount = (set) => {
  const params = new URL(window.location.href).searchParams
  const n = params.get('network')
  if (n && isChainSupported(n)) {
    set(n.toLowerCase())
  } else {
    set(defaultChain.name)
  }
}

function useLocalNetwork() {
  const [sessionNetwork] = useSessionNetwork()
  const queryNetwork = useAtomValue(queryNetworkAtom)
  const { query } = useRouter()

  const network = sessionNetwork || query.network || queryNetwork

  if (typeof network === 'string' && isChainSupported(network)) {
    return network
  }

  return undefined
}

export function useActiveNetwork() {
  const localNetworkName = useLocalNetwork()
  const { chain } = useNetwork()
  const queryNetwork = useAtomValue(queryNetworkAtom)
  // until wallet support switch network, we follow wallet chain instead of routing

  return useMemo(() => {
    let networkName: string | undefined

    if (queryNetwork === '') {
      return {
        networkName,
      }
    }

    networkName = chain?.name ?? localNetworkName

    return {
      networkName,
    }
  }, [queryNetwork, chain?.name, localNetworkName])
}

export function useActiveChainId() {
  const { networkName } = useActiveNetwork()

  return useMemo(
    () => chains.find((c) => equalsIgnoreCase(c.network, networkName))?.id ?? defaultChain.id,
    [networkName],
  )
}
