import { useTranslation } from '@pancakeswap/localization'
import { ChoosePairView } from '@pancakeswap/uikit/src/widgets/Liquidity'
import { CommitButton } from 'components/CommitButton'
import _noop from 'lodash/noop'
import { useContext } from 'react'
import { useCurrencySelectRoute, CurrencySelectorContext } from '../hooks/useCurrencySelectRoute'
import { MintPairContext } from '../hooks/useMintPair'
import { CurrencySelect } from './CurrencySelect'

export default function ChoosePair({ onNext }) {
  const { error } = useContext(MintPairContext)
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()
  const { currencyA, currencyB } = useContext(CurrencySelectorContext)
  const { t } = useTranslation()

  return (
    <ChoosePairView
      selectCurrencyA={
        <CurrencySelect
          onCurrencySelect={handleCurrencyASelect}
          otherSelectedCurrency={currencyB}
          selectedCurrency={currencyA}
        />
      }
      selectCurrencyB={
        <CurrencySelect
          onCurrencySelect={handleCurrencyBSelect}
          otherSelectedCurrency={currencyA}
          selectedCurrency={currencyB}
        />
      }
      footer={
        <CommitButton
          data-test="choose-pair-next"
          width="100%"
          variant={error ? 'danger' : 'primary'}
          onClick={onNext}
          disabled={Boolean(error)}
        >
          {error ?? t('Add Liquidity')}
        </CommitButton>
      }
      poolData={{
        lpApr7d: 1,
      }}
    />
  )
}
