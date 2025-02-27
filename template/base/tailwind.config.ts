import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  important: '#__nextBody',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      sm: '600px',
      md: '768px',
      lg: '992px',
      xl: '1440px'
    },
    fontFamily: {
      Inter: ['var(--font-Inter)', ...defaultTheme.fontFamily.sans],
      EBGaramond: ['var(--font-EBGaramond)', ...defaultTheme.fontFamily.sans]
    },
    extend: {
      colors: {
        primary: '#012232'
      },
      maxWidth: {
        page: '1440px'
      }
    }
  },
  plugins: []
} satisfies Config
