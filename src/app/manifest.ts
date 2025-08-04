import type { MetadataRoute } from "next";

const { appName, description } = {
  appName: "Nodara Network",
  description:
    "Nodara Network powers the decentralized future with robust Web3 infrastructure. Explore our solutions in blockchain scaling, validator services, and developer tools for decentralized applications. Join the movement to build a more secure, permissionless internet.",
};

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: "Nodara",
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: ["business", "productivity", "utilities", "finance"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    screenshots: [
      {
        src: "/open-graph.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Nodara Dashboard"
      }
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "View your Nodara dashboard",
        url: "/dashboard",
        icons: [
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96"
          }
        ]
      },
      {
        name: "Analytics",
        short_name: "Analytics",
        description: "View analytics and insights",
        url: "/analytics",
        icons: [
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96"
          }
        ]
      }
    ]
  };
}