import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { supabase } from '../utils/supabase'


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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // エラーが発生した場合はリトライしない
      refetchOnWindowFocus: false, // ウィンドウがフォーカスされた時に再フェッチしない
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter()

  // ログイン状態の認識
  const validateSession = async () => {
    const user = supabase.auth.user()
    if (user && pathname === '/') {
      push('/dashboard')
    } else if (!user && pathname !== '/') {
      push('/')
    }
  }

  // ログイン状態の変更に反応してページ遷移
  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('/dashboard')
    } else if (event === 'SIGNED_OUT') {
      push('/')
    }
  })

  // ページ遷移時にログイン状態の認識
  useEffect(() => {
    validateSession()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
