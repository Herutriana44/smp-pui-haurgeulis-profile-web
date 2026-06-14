import type { Metadata } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'

import { JsonLd } from '@/components/json-ld'
import { Toaster } from '@/components/ui/sonner'
import { ChatbotProvider } from '@/components/chatbot-provider'
import { siteConfig } from '@/lib/site-config'
import { getSeoConfig } from '@/lib/seo-config'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoConfig()
  const baseUrl = seo.url.replace(/\/$/, '')
  const ogImage = seo.openGraphImage.startsWith('http')
    ? seo.openGraphImage
    : `${baseUrl}${seo.openGraphImage.startsWith('/') ? '' : '/'}${seo.openGraphImage}`

  return {
    metadataBase: new URL(seo.url),
    title: {
      default: `${seo.name} - ${seo.titleTemplate}`,
      template: `%s | ${seo.name}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.name, url: seo.url }],
    creator: seo.name,
    publisher: seo.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: seo.url,
      siteName: seo.name,
      title: `${seo.name} - ${seo.titleTemplate}`,
      description: seo.description,
      images: [{ url: ogImage, alt: seo.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${seo.name} - ${seo.titleTemplate}`,
      description: seo.description,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
      googleBot: {
        index: seo.robotsIndex,
        follow: seo.robotsFollow,
      },
    },
    alternates: { canonical: seo.url },
    icons: {
      icon: siteConfig.logo,
      shortcut: siteConfig.logo,
      apple: siteConfig.logo,
    },
    verification: seo.googleVerification
      ? { google: seo.googleVerification }
      : undefined,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const seo = await getSeoConfig()
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${nunito.variable} ${nunitoSans.variable} font-sans antialiased`}
      >
        <JsonLd config={seo} />
        {children}
        <Toaster />
        <ChatbotProvider />
      </body>
    </html>
  )
}
