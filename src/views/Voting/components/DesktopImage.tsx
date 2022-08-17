import { Image } from '@pancakeswap/uikit'
import styled from '@emotion/styled'

const DesktopImage = styled(Image)`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

export default DesktopImage
