import { useContext, useEffect } from 'react'
import { Theme, ThemeContext as StyledThemeContext } from '@emotion/react'
import Cookie from 'js-cookie'
import { COOKIE_THEME_KEY, THEME_DOMAIN } from 'hooks/useTheme'

const useThemeCookie = () => {
  const theme = useContext(StyledThemeContext) as Theme
  const themeValue = theme.isDark ? 'dark' : 'light'

  useEffect(() => {
    const getThemeCookie = Cookie.get(COOKIE_THEME_KEY, { domain: THEME_DOMAIN })

    if (!getThemeCookie && getThemeCookie !== themeValue) {
      Cookie.set(COOKIE_THEME_KEY, themeValue, { domain: THEME_DOMAIN })
    }
  }, [themeValue])
}

export default useThemeCookie
