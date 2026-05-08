import { RootProvider } from 'fumadocs-ui/provider/next';
import '../global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { i18nUI } from '@/lib/i18n';
import type { Metadata } from 'next';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const p = await params;
  return (
    <html lang={p.lang} className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={i18nUI.provider(p.lang)}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

