import { css, Global } from '@pancakeswap/styled'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module '@pancakeswap/styled' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface Theme extends PancakeTheme {}
}

const GlobalStyle = () => (
  <Global
    styles={(theme) => css`
      * {
        font-family: 'Kanit', sans-serif;
      }
      body {
        background-color: ${theme.colors.background};

        img {
          height: auto;
          max-width: 100%;
        }
      }
    `}
  />
)

export default GlobalStyle
