// import { UnsupportedChainIdError } from '@web3-react/core'
import { ConnectorNames } from '@pancakeswap/uikit'
// import { connectorsByName } from 'utils/web3React'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useAppDispatch } from 'state'
import { useConnect, useDisconnect, useNetwork } from 'wagmi'
import { clearUserStates } from '../utils/clearUserStates'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { connect, connectors } = useConnect()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { toastError } = useToast()

  const login = async (connectorId: ConnectorNames) => {
    const findConnector = connectors.find((c) => c.id === connectorId)
    connect({ connector: findConnector })
  }
  const logout = () => {
    disconnect()
    clearUserStates(dispatch, chain?.id, true)
  }

  // const login = useCallback(
  //   async (connectorID: ConnectorNames) => {
  // const connectorOrGetConnector = connectorsByName[connectorID]
  // const connector =
  //   typeof connectorOrGetConnector !== 'function' ? connectorsByName[connectorID] : await connectorOrGetConnector()

  //     if (typeof connector !== 'function' && connector) {
  //       activate(connector, async (error: Error) => {
  //         if (error instanceof UnsupportedChainIdError) {
  //           setError(error)
  //           const provider = await connector.getProvider()
  //           const hasSetup = await setupNetwork(provider)
  //           if (hasSetup) {
  //             activate(connector)
  //           }
  //         } else {
  //           window?.localStorage?.removeItem(connectorLocalStorageKey)
  //           if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
  //             toastError(
  //               t('Provider Error'),
  //               <Box>
  //                 <Text>{t('No provider was found')}</Text>
  //                 <LinkExternal href="https://docs.pancakeswap.finance/get-started/connection-guide">
  //                   {t('Need help ?')}
  //                 </LinkExternal>
  //               </Box>,
  //             )
  //           } else if (
  //             error instanceof UserRejectedRequestErrorInjected ||
  //             error instanceof UserRejectedRequestErrorWalletConnect
  //           ) {
  //             if (connector instanceof WalletConnectConnector) {
  //               const walletConnector = connector as WalletConnectConnector
  //               walletConnector.walletConnectProvider = null
  //             }
  //             toastError(t('Authorization Error'), t('Please authorize to access your account'))
  //           } else {
  //             toastError(error.name, error.message)
  //           }
  //         }
  //       })
  //     } else {
  //       window?.localStorage?.removeItem(connectorLocalStorageKey)
  //       toastError(t('Unable to find connector'), t('The connector config is wrong'))
  //     }
  //   },
  //   [t, activate, toastError, setError],
  // )

  // const logout = useCallback(() => {
  //   deactivate()
  //   clearUserStates(dispatch, chainId, true)
  // }, [deactivate, dispatch, chainId])

  return { login, logout }
}

export default useAuth
