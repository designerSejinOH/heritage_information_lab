import { Layout } from '@/components'
import { Metadata, Viewport } from 'next'
import { Config } from './config'
import localFont from 'next/font/local'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import '@/styles/global.css'

export const metadata: Metadata = {
  alternates: {
    canonical: Config.url,
  },
  title: {
    default: Config.title,
    template: Config.titleTemplate,
  },
  description: Config.description,
  keywords: Config.keywords,
  authors: Config.authors,
  creator: 'SEJIN OH',
  publisher: 'SEJIN OH',
  manifest: '/manifest.json',
  generator: 'SEJIN OH',
  applicationName: Config.name,

  category: 'webapp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: Config.name,
    title: {
      default: Config.title,
      template: Config.titleTemplate,
    },
    description: Config.description,
    locale: 'ko_KR',
    url: Config.url,
    images: {
      url: '/icons/op-image.png',
    },
  },
  verification: {
    google: Config.google_site_verification,
  },
  referrer: 'origin-when-cross-origin',
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: {
      rel: 'mask-icon',
      url: '/icons/safari-pinned-tab.svg',
      color: '#000000',
    },
  },
}

const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/PretendardVariable.woff2',
      weight: '45 920',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      <body className={`${pretendard.className}`}>
        <Layout>{children}</Layout>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  )
}
