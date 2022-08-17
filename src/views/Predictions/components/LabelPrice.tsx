import { useMemo, memo } from 'react'
import CountUp from 'react-countup'
import { Text } from '@pancakeswap/uikit'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import styled from '@emotion/styled'
import { BigNumber } from '@ethersproject/bignumber'

const Price = styled(Text)`
  height: 18px;
  justify-self: start;
  width: 70px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
  }
`

interface LabelPriceProps {
  price: BigNumber
}

const LabelPrice: React.FC<React.PropsWithChildren<LabelPriceProps>> = ({ price }) => {
  const priceAsNumber = useMemo(() => parseFloat(formatBigNumberToFixed(price, 4, 8)), [price])

  return (
    <CountUp start={0} preserveValue delay={0} end={priceAsNumber} prefix="$" decimals={4} duration={1}>
      {({ countUpRef }) => (
        <Price fontSize="12px">
          <span ref={countUpRef} />
        </Price>
      )}
    </CountUp>
  )
}

export default memo(LabelPrice)
