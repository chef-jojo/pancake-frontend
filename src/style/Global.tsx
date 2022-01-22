import { createGlobalStyle } from 'styled-components'
import React, { memo } from 'react'
import { KEY_PREFIX } from 'redux-persist'
import { PancakeTheme, darkColors, lightColors } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }

  /* for first paint background */
  :root {
    --pancake-background: ${lightColors.background};
  }
  [data-theme='dark'] {
    --pancake-background: ${darkColors.background};
  }

  body {
    background-color: var(--pancake-background);

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export const NextThemeHead = memo(() => (
  <script
    key="theme-script"
    // minify by terser
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `t=document.documentElement;try{var e=localStorage.getItem("${KEY_PREFIX}primary"),a=JSON.parse(e).user;JSON.parse(a).isDark&&t.setAttribute("data-theme","dark")}catch(t){}`,
    }}
  />
))

export default GlobalStyle
