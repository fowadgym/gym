import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
        },
        amber: {
          500: '#F59E0B',
        },
        lime: {
          500: '#84CC16',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        arabic: ['var(--font-cairo)'],
      },
    },
  },
  plugins: [],
}
export default config
