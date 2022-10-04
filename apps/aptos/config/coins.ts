import { AptosCoin, ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'

export const APT = {
  [ChainId.DEVNET]: AptosCoin.onChain(ChainId.DEVNET),
  [ChainId.TESTNET]: AptosCoin.onChain(ChainId.TESTNET),
}

export const USDC = {
  [ChainId.DEVNET]: new Coin(
    ChainId.DEVNET,
    '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC',
    8,
    'USDC',
    'USD coin',
  ),
  [ChainId.TESTNET]: new Coin(
    ChainId.TESTNET,
    '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC',
    8,
    'USDC',
    'USD coin',
  ),
}
