import { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { CssBaseline, useMediaQuery } from '@mui/material'
import { createTheme, StyledEngineProvider, ThemeProvider, useTheme } from '@mui/material/styles'
import type { AppProps } from 'next/app'

import Layout from '@/components/layout'
import { useApollo } from '@/lib/apolloClient'
import { ebGaramond, inter } from '@/lib/font'
import { themeConfig } from '@/lib/themeConfig'

import '@/styles/globals.css'

const theme = createTheme(themeConfig)

export default function App({ Component, pageProps }: AppProps) {
  const { isMobileDevice = false } = pageProps || {}
  const themeConfig = useTheme()
  const mediaQuery = useMediaQuery(themeConfig.breakpoints.up('lg'))
  const [isPC, setIsPC] = useState(!isMobileDevice)
  useEffect(() => {
    setIsPC(mediaQuery)
  }, [mediaQuery])

  const client = useApollo(pageProps, {})

  return (
    <>
      <style jsx global>{`
        :root {
          --font-EBGaramond: ${ebGaramond.style.fontFamily};
          --font-Inter: ${inter.style.fontFamily};
      `}</style>
      <ApolloProvider client={client}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout {...pageProps} isPC={isPC}>
              <Component {...pageProps} isPC={isPC} />
            </Layout>
          </ThemeProvider>
        </StyledEngineProvider>
      </ApolloProvider>
    </>
  )
}
