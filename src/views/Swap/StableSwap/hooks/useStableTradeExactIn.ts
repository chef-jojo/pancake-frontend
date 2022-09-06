import { CurrencyAmount, Price, Percent, TradeType, Fraction, ONE, Currency } from '@pancakeswap/sdk'
import { useCallback, useMemo, useContext } from 'react'
import useSWR from 'swr'
import { StableConfigContext } from './useStableConfig'

export interface StableTrade {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: null
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency>
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency>
}

export const maximumAmountInFactory = (currencyAmountIn: CurrencyAmount<Currency>, slippageTolerance: number) => {
  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(currencyAmountIn.quotient).quotient
  return CurrencyAmount.fromRawAmount(currencyAmountIn.currency, slippageAdjustedAmountIn)
}

export const minimumAmountOutFactory = (currencyAmountOut: CurrencyAmount<Currency>, slippageTolerance: number) => {
  const slippageAdjustedAmountOut = new Fraction(ONE)
    .add(slippageTolerance)
    .invert()
    .multiply(currencyAmountOut.quotient).quotient
  return CurrencyAmount.fromRawAmount(currencyAmountOut.currency, slippageAdjustedAmountOut)
}

interface UseStableTradeResponse {
  currencyAmountIn: CurrencyAmount<Currency>
  currencyAmountOut: CurrencyAmount<Currency>
  stableSwapConfig: any
}

export function useStableTradeResponse({
  currencyAmountIn,
  currencyAmountOut,
  stableSwapConfig,
}: UseStableTradeResponse) {
  const maximumAmountIn = useCallback(
    (slippageTolerance) =>
      currencyAmountIn
        ? maximumAmountInFactory(currencyAmountIn, slippageTolerance)
        : CurrencyAmount.fromRawAmount(currencyAmountIn.currency, '0'),
    [currencyAmountIn],
  )

  const minimumAmountOut = useCallback(
    (slippageTolerance) =>
      currencyAmountOut
        ? minimumAmountOutFactory(currencyAmountOut, slippageTolerance)
        : CurrencyAmount.fromRawAmount(currencyAmountOut.currency, '0'),
    [currencyAmountOut],
  )

  const isInvalid = !currencyAmountIn || !currencyAmountOut || !stableSwapConfig || !currencyAmountIn

  const executionPrice = useMemo(() => {
    if (isInvalid) return null

    return new Price(
      currencyAmountIn.currency,
      currencyAmountOut.currency,
      currencyAmountIn.quotient,
      currencyAmountOut.quotient,
    )
  }, [isInvalid, currencyAmountIn, currencyAmountOut])

  if (isInvalid) return null

  return {
    tradeType: TradeType.EXACT_INPUT,
    inputAmount: currencyAmountIn,
    outputAmount: currencyAmountOut,
    executionPrice,
    priceImpact: null,
    maximumAmountIn,
    minimumAmountOut,
  }
}

export function useEstimatedAmount({ estimatedCurrency, stableSwapConfig, quotient, stableSwapContract }) {
  return useSWR(
    stableSwapConfig?.stableSwapAddress && estimatedCurrency && !!quotient
      ? ['swapContract', stableSwapConfig?.stableSwapAddress, quotient]
      : null,
    async () => {
      const isToken0 = stableSwapConfig?.token0?.address === estimatedCurrency?.address

      const args = isToken0 ? [1, 0, quotient] : [0, 1, quotient]

      const estimatedAmount = await stableSwapContract.get_dy(...args)

      return CurrencyAmount.fromRawAmount(estimatedCurrency, estimatedAmount)
    },
  )
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export default function useStableTradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
): StableTrade | null {
  const { stableSwapContract, stableSwapConfig } = useContext(StableConfigContext)

  const currencyAmountInQuotient = currencyAmountIn?.quotient?.toString()

  const { data: currencyAmountOut } = useEstimatedAmount({
    estimatedCurrency: currencyOut,
    quotient: currencyAmountInQuotient,
    stableSwapContract,
    stableSwapConfig,
  })

  return useStableTradeResponse({
    currencyAmountIn,
    currencyAmountOut,
    stableSwapConfig,
  })
}
