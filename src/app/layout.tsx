import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AppProviders } from "@/components/AppProviders";
import TaskProviderWrapper from "@/components/TaskProviderWrapper";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAStatus } from "@/components/PWAStatus";

export const metadata: Metadata = {
  title: "Nodara Network - Decentralized Compute Power",
  description: "Serverless Functions, Rented From Smartphones Near You. Rent compute power, pay in SOL.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nodara",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
      },
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
      },
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
      }
    ]
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/newlogo.jpeg", sizes: "16x16", type: "image/jpeg" },
      { url: "/newlogo.jpeg", sizes: "32x32", type: "image/jpeg" },
      { url: "/newlogo.jpeg", sizes: "192x192", type: "image/jpeg" },
      { url: "/newlogo.jpeg", sizes: "512x512", type: "image/jpeg" }
    ],
    apple: [
      { url: "/newlogo.jpeg", sizes: "192x192", type: "image/jpeg" }
    ],
    shortcut: [
      { url: "/newlogo.jpeg", sizes: "192x192", type: "image/jpeg" }
    ]
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Nodara",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/icons/browserconfig.xml"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Nodara" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nodara" />
        <meta name="description" content="Nodara Network - Decentralized Compute Power" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon-precomposed" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/newlogo.jpeg" />
        <link rel="image_src" href="/logo.png" />
      </head>
      <body>
        <GoogleAnalytics />
        <ServiceWorkerRegistration />
        <AppProviders>
          <TaskProviderWrapper>
            {children}
          </TaskProviderWrapper>
        </AppProviders>
        <PWAInstallPrompt />
        <PWAStatus />
        {/* <ConnectionDebug /> */}
      </body>
    </html>
  );
}

// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}