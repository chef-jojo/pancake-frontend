// dApps can make requests to the wallet from their website:
// - `connect()`: prompts the user to allow connection from the dApp (*neccessary to make other requests*)
// - `isConnected()`: returns if the dApp has established a connection with the wallet
// - `account()`: gets the address of the account signed into the wallet
// - `signAndSubmitTransaction(transaction)`: signs the given transaction and submits to chain
// - `signTransaction(transaction)`: signs the given transaction and returns it to be submitted by the dApp
// - `disconnect()`: Removes connection between dApp and wallet. Useful when the user wants to remove the connection.

import EventEmitter from 'eventemitter3'
import { Chain, defaultChains } from '../chain'

export type Account = {
  address: string
  publicKey?: string
}

export type Network = {
  networkName: string
}

export type ConnectorData = {
  account?: Account
  network?: Network
}

export interface ConnectorEvents {
  change(data: ConnectorData): void
  connect(): void
  message({ type, data }: { type: string; data?: unknown }): void
  disconnect(): void
  error(error: Error): void
}

export abstract class Connector extends EventEmitter<ConnectorEvents> {
  atpos?: any
  readonly chains: Chain[]

  constructor({ chains = defaultChains }: { chains?: Chain[] }) {
    super()
    this.chains = chains
  }

  abstract id: string
  abstract name: string

  abstract readonly ready: boolean

  abstract connect(): Promise<Account>

  abstract disconnect(): Promise<void>

  abstract account(): Promise<Account>
  abstract network(): Promise<string>

  abstract signAndSubmitTransaction(transaction?: unknown): Promise<unknown>

  abstract signTransaction(transaction?: unknown): Promise<unknown>

  // abstract getChainId(): Promise<number>;
  // abstract getProvider(config?: {
  //   chainId?: number;
  // }): Promise<Provider>;
  // abstract getSigner(config?: { chainId?: number }): Promise<Signer>;
  abstract isConnected(): Promise<boolean>
}
