import { Analytics } from '@vercel/analytics/next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { GeistSans } from 'geist/font/sans'

import '@/styles/globals.css'
import '@/styles/syntax-highlight.css'
import type { Metadata } from 'next'

import { PaletteProvider } from '@/components/providers/palette-provider'
import { StyleProvider } from '@/components/providers/style-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { i18nUI } from '@/lib/layout.shared'

export const metadata: Metadata = {
  title: {
    template: '%s | Catcher',
    default: 'Catcher - Standardized Error Handling',
  },
  description: 'Functional error handling with the Result pattern for TypeScript',
  openGraph: {
    title: 'Catcher',
    description: 'Standardized Error Handling for TypeScript',
    siteName: 'Catcher',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catcher',
    description: 'Standardized Error Handling for TypeScript',
    images: ['/og'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
  },
}

/**
 * Root layout component that renders the HTML document and wraps the app's UI with global providers for fonts, styles, theme, palette, and UI root.
 *
 * @param params - Promise resolving to route parameters; must include `lang`, the page language code
 * @param children - The application content to be rendered inside the root providers
 * @returns The top-level HTML structure containing the provided children wrapped by global providers and including analytics
 */
export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}) {
  const lang = (await params).lang

  return (
    <html className={GeistSans.className} lang={lang} suppressHydrationWarning>
      <head>
        <link href="/icon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon.ico" rel="icon" sizes="any" />
        <link href="/favicon.svg" rel="shortcut icon" />
      </head>
      <body>
        <div className="root">
          <StyleProvider>
            <ThemeProvider
              defaultTheme="dark"
              disableTransitionOnChange
              enableSystem
              storageKey="theme"
            >
              <PaletteProvider>
                <RootProvider i18n={i18nUI.provider(lang)} search={{ enabled: false }}>
                  {children}
                  <Analytics />
                </RootProvider>
              </PaletteProvider>
            </ThemeProvider>
          </StyleProvider>
        </div>
      </body>
    </html>
  )
}
