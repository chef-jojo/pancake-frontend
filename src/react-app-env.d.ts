interface Window {
  bn?: any
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
  } & Ethereum
}

type SerializedBigNumber = string

declare let __NEZHA_BRIDGE__: any
