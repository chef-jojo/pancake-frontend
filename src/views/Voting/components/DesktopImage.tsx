import { Image } from '@pancakeswap/uikit'
import styled from '@pancakeswap/styled'

const DesktopImage = styled(Image)`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

export default DesktopImage
