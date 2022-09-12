import { EntryFunctionPayload, PendingTransaction } from 'aptos/dist/generated'
import { Chain } from '../chain'
import { Connector } from './base'
import { ConnectorNotFoundError } from './errors'

declare global {
  interface Window {
    martian?: any
  }
}

export class MartianConnector extends Connector {
  readonly id = 'martian'
  readonly name = 'Martain'
  provider?: Window['martian']

  readonly ready = typeof window !== 'undefined' && !!window.martian
  constructor(chains?: Chain[]) {
    super({
      chains,
    })
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.martian) this.provider = window.martian
    return this.provider
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.onAccountChange) {
        provider.onAccountChange(this.onAccountsChanged)
      }
      if (provider.onNetworkChange) {
        provider.onNetworkChange(this.onNetworkChanged)
      }

      this.emit('message', { type: 'connecting' })

      return await provider.connect()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider) return
    // eslint-disable-next-line consistent-return
    return provider.disconnect()
  }

  async account() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.account()
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.network()
  }

  async isConnected() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      return provider.isConnected()
    } catch {
      return false
    }
  }

  async signAndSubmitTransaction(payload: EntryFunctionPayload): Promise<PendingTransaction> {
    const provider = await this.getProvider()
    const account = await this.account()
    if (!provider) throw new ConnectorNotFoundError()
    const generatedTx = await provider.generateTransaction(account?.address || '', payload)
    return provider.signAndSubmitTransaction(generatedTx)
  }

  async signTransaction(payload: EntryFunctionPayload) {
    const provider = await this.getProvider()
    const account = await this.account()
    if (!provider) throw new ConnectorNotFoundError()
    const transaction = await provider.generateTransaction(account?.address || '', payload)
    return provider.signTransaction(transaction)
  }

  protected onAccountsChanged = (address: string) => {
    this.emit('change', {
      account: {
        address,
      },
    })
  }

  protected onNetworkChanged = (networkName: string) => {
    this.emit('change', {
      network: {
        networkName,
      },
    })
  }
}
