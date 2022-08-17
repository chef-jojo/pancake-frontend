import styled from '@pancakeswap/styled'
import { Grid, Box } from '@pancakeswap/uikit'

export const AddressColumn = styled(Box)`
  grid-area: address;
`

AddressColumn.defaultProps = { alignItems: 'center' }

export const ChoiceColumn = styled(Box)`
  grid-area: choice;
  overflow: hidden;
`

export const VotingPowerColumn = styled(Box)`
  justify-self: end;
  grid-area: vote;
`

const Row = styled(Grid)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  grid-gap: 8px;
  grid-template-areas:
    'address address address'
    'choice choice vote';
  grid-template-columns: 1fr 1fr 120px;
  padding: 8px 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
    grid-template-areas: 'address choice vote';
    padding: 16px 24px;
  }
`

export default Row
