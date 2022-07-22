import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import { connectorsByName } from 'utils/web3React'
import { Connector } from '@web3-react/types'
import { network } from '../connectors/network'

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

const _ethereumListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'ethereum', {
      get() {
        return this._eth
      },
      set(_eth) {
        this._eth = _eth

        resolve()
      },
    }),
  )

const safeGetLocalStorageItem = () => {
  try {
    return (
      typeof window?.localStorage?.getItem === 'function' &&
      (window?.localStorage?.getItem(connectorLocalStorageKey) as ConnectorNames)
    )
  } catch (err: any) {
    // Ignore Local Storage Browser error
    // - NS_ERROR_FILE_CORRUPTED
    // - QuotaExceededError
    console.error(`Local Storage error: ${err?.message}`)

    return null
  }
}

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export function useEagerlyConnect() {
  useEffect(() => {
    connect(network)
    const connectorId = safeGetLocalStorageItem()

    if (connectorId) {
      if (connectorsByName[connectorId]) {
        connect(connectorsByName[connectorId])
      }
    }
    // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useEagerlyConnect
