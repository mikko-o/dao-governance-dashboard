import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import axios from 'axios'
import TimeAgo from 'javascript-time-ago'
import { swrFetcher } from '../api'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: swrFetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}
export default MyApp
