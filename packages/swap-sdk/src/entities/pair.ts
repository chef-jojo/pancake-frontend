import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { Price } from './fractions/price'

import {
  BigintIsh,
  FACTORY_ADDRESS_MAP,
  FIVE,
  INIT_CODE_HASH_MAP,
  MINIMUM_LIQUIDITY,
  ONE,
  ZERO,
  _10000,
  _9975,
} from '../constants'
import { InsufficientInputAmountError, InsufficientReservesError } from '../errors'
import { sqrt } from '../utils'
import { CurrencyAmount } from './fractions'
import { Token } from './token'

let PAIR_ADDRESS_CACHE: { [key: string]: string } = {
  '56-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56':
    '0x804678fa97d91B974ec2af3c843270886528a9E6',
  '56-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56':
    '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  '56-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c':
    '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
  '56-0x55d398326f99059fF775485246999027B3197955-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c':
    '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE',
  '56-0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c':
    '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
  '56-0x2170Ed0880ac9A755fd29B2688956BD959F933F8-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c':
    '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc',
  '56-0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c':
    '0xd99c7F6C65857AC913a8f880A4cb84032AB2FC5b',
  '56-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0x55d398326f99059fF775485246999027B3197955':
    '0xA39Af17CE4a8eb807E076805Da1e2B8EA7D0755b',
  '56-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c':
    '0x3b2B70Dd9684deEE3f942653a418bE34fc0D525b',
  '56-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0x2170Ed0880ac9A755fd29B2688956BD959F933F8':
    '0x3f23B4F1a35794306ba4f3176934012dC73312D1',
  '56-0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82-0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d':
    '0x177d955dCA80443A09E7a7F5946cA16b8E0dcA1C',
  '56-0x55d398326f99059fF775485246999027B3197955-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56':
    '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
  '56-0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56':
    '0xF45cd219aEF8618A92BAa7aD848364a158a24F33',
  '56-0x2170Ed0880ac9A755fd29B2688956BD959F933F8-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56':
    '0x7213a321F1855CF1779f42c0CD85d3D95291D34C',
  '56-0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56':
    '0x2354ef4DF11afacb85a5C7f98B624072ECcddbB1',
  '56-0x55d398326f99059fF775485246999027B3197955-0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c':
    '0x3F803EC2b816Ea7F06EC76aA2B6f2532F9892d62',
  '56-0x2170Ed0880ac9A755fd29B2688956BD959F933F8-0x55d398326f99059fF775485246999027B3197955':
    '0x531FEbfeb9a61D948c384ACFBe6dCc51057AEa7e',
  '56-0x55d398326f99059fF775485246999027B3197955-0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d':
    '0xEc6557348085Aa57C72514D67070dC863C0a5A8c',
  '56-0x2170Ed0880ac9A755fd29B2688956BD959F933F8-0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c':
    '0xD171B26E4484402de70e3Ea256bE5A2630d7e88D',
  '56-0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c-0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d':
    '0x2dF244535624761f6fCc381CaE3e9b903429d9Ff',
  '56-0x2170Ed0880ac9A755fd29B2688956BD959F933F8-0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d':
    '0xEa26B78255Df2bBC31C1eBf60010D78670185bD0',
}

const composeKey = (token0: Token, token1: Token) => `${token0.chainId}-${token0.address}-${token1.address}`

export const computePairAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
}): string => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const key = composeKey(token0, token1)

  if (PAIR_ADDRESS_CACHE?.[key] === undefined) {
    PAIR_ADDRESS_CACHE = {
      ...PAIR_ADDRESS_CACHE,
      [key]: getCreate2Address(
        factoryAddress,
        keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
        INIT_CODE_HASH_MAP[token0.chainId]
      ),
    }
  }

  return PAIR_ADDRESS_CACHE[key]
}

export class Pair {
  public readonly liquidityToken: Token
  private readonly tokenAmounts: [CurrencyAmount<Token>, CurrencyAmount<Token>]

  public static getAddress(tokenA: Token, tokenB: Token): string {
    return computePairAddress({ factoryAddress: FACTORY_ADDRESS_MAP[tokenA.chainId], tokenA, tokenB })
  }

  public constructor(currencyAmountA: CurrencyAmount<Token>, tokenAmountB: CurrencyAmount<Token>) {
    const tokenAmounts = currencyAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [currencyAmountA, tokenAmountB]
      : [tokenAmountB, currencyAmountA]
    this.liquidityToken = new Token(
      tokenAmounts[0].currency.chainId,
      Pair.getAddress(tokenAmounts[0].currency, tokenAmounts[1].currency),
      18,
      'Cake-LP',
      'Pancake LPs'
    )
    this.tokenAmounts = tokenAmounts as [CurrencyAmount<Token>, CurrencyAmount<Token>]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price<Token, Token> {
    const result = this.tokenAmounts[1].divide(this.tokenAmounts[0])
    return new Price(this.token0, this.token1, result.denominator, result.numerator)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<Token, Token> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new Price(this.token1, this.token0, result.denominator, result.numerator)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price<Token, Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  public get token0(): Token {
    return this.tokenAmounts[0].currency
  }

  public get token1(): Token {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): CurrencyAmount<Token> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): CurrencyAmount<Token> {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: Token): CurrencyAmount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(inputAmount: CurrencyAmount<Token>): [CurrencyAmount<Token>, Pair] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.quotient, _9975)
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, _10000), inputAmountWithFee)
    const outputAmount = CurrencyAmount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator)
    )
    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getInputAmount(outputAmount: CurrencyAmount<Token>): [CurrencyAmount<Token>, Pair] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.quotient, ZERO) ||
      JSBI.equal(this.reserve1.quotient, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), _10000)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.quotient, outputAmount.quotient), _9975)
    const inputAmount = CurrencyAmount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE)
    )
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getLiquidityMinted(
    totalSupply: CurrencyAmount<Token>,
    tokenAmountA: CurrencyAmount<Token>,
    tokenAmountB: CurrencyAmount<Token>
  ): CurrencyAmount<Token> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN')

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(
        sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)),
        MINIMUM_LIQUIDITY
      )
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), this.reserve0.quotient)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), this.reserve1.quotient)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return CurrencyAmount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: CurrencyAmount<Token>,
    liquidity: CurrencyAmount<Token>,
    feeOn: boolean = false,
    kLast?: BigintIsh
  ): CurrencyAmount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient), 'LIQUIDITY')

    let totalSupplyAdjusted: CurrencyAmount<Token>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = JSBI.BigInt(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.quotient, this.reserve1.quotient))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.quotient, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(CurrencyAmount.fromRawAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return CurrencyAmount.fromRawAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupplyAdjusted.quotient)
    )
  }
}
