import { useCallback } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useAppDispatch } from 'state'
import { connectorsByName } from 'utils/web3React'
import { clearUserStates } from '../utils/clearUserStates'
import useActiveWeb3React from './useActiveWeb3React'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { chainId, connector } = useActiveWeb3React()
  const { toastError } = useToast()

  const login = useCallback(async (connectorID: ConnectorNames) => {
    if (connectorsByName[connectorID]) {
      connectorsByName[connectorID].activate().catch((err) => {
        window?.localStorage?.removeItem(connectorLocalStorageKey)
        console.error(err)
      })
    }
    // const connectorOrGetConnector = connectorsByName[connectorID]
    // const connector =
    //   typeof connectorOrGetConnector !== 'function' ? connectorsByName[connectorID] : await connectorOrGetConnector()
    // if (typeof connector !== 'function' && connector) {
    //   activate(connector, async (error: Error) => {
    //     if (error instanceof UnsupportedChainIdError) {
    //       setError(error)
    //       const provider = await connector.getProvider()
    //       const hasSetup = await setupNetwork(56, provider)
    //       if (hasSetup) {
    //         activate(connector)
    //       }
    //     } else {
    //       window?.localStorage?.removeItem(connectorLocalStorageKey)
    //       if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
    //         toastError(
    //           t('Provider Error'),
    //           <Box>
    //             <Text>{t('No provider was found')}</Text>
    //             <LinkExternal href="https://docs.pancakeswap.finance/get-started/connection-guide">
    //               {t('Need help ?')}
    //             </LinkExternal>
    //           </Box>,
    //         )
    //       } else if (
    //         error instanceof UserRejectedRequestErrorInjected ||
    //         error instanceof UserRejectedRequestErrorWalletConnect
    //       ) {
    //         if (connector instanceof WalletConnectConnector) {
    //           const walletConnector = connector as WalletConnectConnector
    //           walletConnector.walletConnectProvider = null
    //         }
    //         toastError(t('Authorization Error'), t('Please authorize to access your account'))
    //       } else {
    //         toastError(error.name, error.message)
    //       }
    //     }
    //   })
    // } else {
    //   window?.localStorage?.removeItem(connectorLocalStorageKey)
    //   toastError(t('Unable to find connector'), t('The connector config is wrong'))
    // }
  }, [])

  const logout = useCallback(() => {
    connector?.deactivate?.()
    clearUserStates(dispatch, chainId, true)
  }, [connector, dispatch, chainId])

  return { login, logout }
}

export default useAuth
