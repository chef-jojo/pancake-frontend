import { memo } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  background: ${({ theme }) => theme.colors.gradients.violetAlt};
  @media only screen and (max-width: 575px) and (min-height: 740px) {
    height: calc(100vh - 150px);
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    height: calc(100vh - 100px);
  }
  overflow: hidden;
`

export default memo(Container)
