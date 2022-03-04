import { memo } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: ${({ theme }) => theme.colors.gradientsVioletAlt};
  height: calc(100vh - 100px);
  overflow: hidden;
  position: relative;
`

export default memo(Container)
