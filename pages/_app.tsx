import '../styles/globals.css'
import type { AppProps, NextWebVitalsMetric } from 'next/app'

function roundToFixed(value: number, digits: number): number {
  return Number(value.toFixed(digits))
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
  switch (metric.name) {
    case 'CLS':
      console.log(`CLS: ${roundToFixed(metric.value, 2)}`)
      break
    case 'FCP':
      console.log(`FCP: ${roundToFixed(metric.value, 2)}`)
      break
    case 'LCP':
      console.log(`LCP: ${roundToFixed(metric.value, 2)}`)
      break
    case 'TTFB':
      console.log(`TTFB: ${roundToFixed(metric.value, 2)}`)
      break
    case 'Next.js-hydration':
      console.log(
        `Hydration: ${roundToFixed(metric.startTime, 2)} ->
        ${roundToFixed(metric.startTime + metric.value, 2)}`
      )
      break
    default:
      break
  }
  console.log('--------------------------------')
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
