import { Metadata } from "next";

const { title, description, ogImage, baseURL, appName } = {
  title: "Nodara Network | Decentralized Infrastructure for Web3",
  description:
    "Nodara Network powers the decentralized future with robust Web3 infrastructure. Explore our solutions in blockchain scaling, validator services, and developer tools for decentralized applications. Join the movement to build a more secure, permissionless internet.",
  baseURL: "https://nodara.network",
  ogImage: "https://nodara.network/open-graph.png",
  appName: "Nodara Network",
};

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ogImage,
  },
  icons: {
    icon: [
      { rel: "icon", type: "image/x-icon", url: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "48x48",
        url: "/favicon-48x48.png",
      },
      { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
    ],
    apple: "/apple-touch-icon.png",
  },
  applicationName: appName,
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    "Nodara Network",
    "Decentralized Infrastructure",
    "Web3 Infrastructure",
    "Validator Services",
    "Blockchain Scaling",
    "Decentralized Applications",
    "Web3 Developer Tools",
    "Permissionless Networks",
    "Blockchain Nodes",
    "Crypto Infrastructure",
  ],
};