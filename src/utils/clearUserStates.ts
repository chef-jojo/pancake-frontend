import * as Sentry from '@sentry/react'
import { Dispatch } from '@reduxjs/toolkit'
import { resetUserState } from 'state/global/actions'
import { connectorLocalStorageKey } from '@pancakeswap/uikit'
import { LS_ORDERS } from './localStorageOrders'
import getLocalStorageItemKeys from './getLocalStorageItemKeys'

export const clearUserStates = (dispatch: Dispatch<any>, chainId: number) => {
  dispatch(resetUserState({ chainId }))
  Sentry.configureScope((scope) => scope.setUser(null))
  window?.localStorage?.removeItem(connectorLocalStorageKey)
  const lsOrderKeys = getLocalStorageItemKeys(LS_ORDERS)
  lsOrderKeys.forEach((lsOrderKey) => window?.localStorage?.removeItem(lsOrderKey))
}
