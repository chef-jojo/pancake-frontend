/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { isMobile } from 'react-device-detect'
import { injected } from 'utils/web3React'

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

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    // @ts-ignore
    const vConsole = new window.VConsole()
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    if (connectorId) {
      console.log(connectorId, 'connectorId')
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => login(connectorId))

        return
      }

      const isConnectorInjected = connectorId === ConnectorNames.Injected
      console.log(isConnectorInjected, 'isConnectorInjected')
      if (isConnectorInjected) {
        injected.isAuthorized().then((isAuthorized) => {
          console.log(isAuthorized, 'isAuthorized')
          console.log({ isMobile, e: window.ethereum })
          if (isAuthorized) {
            login(connectorId)
          } else if (isMobile && window.ethereum) {
            login(connectorId)
          }
        })
      } else {
        login(connectorId)
      }
    }
  }, [login])
}

export default useEagerConnect
