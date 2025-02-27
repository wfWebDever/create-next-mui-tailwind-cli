import { EB_Garamond, Inter } from 'next/font/google'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

export { ebGaramond, inter }
