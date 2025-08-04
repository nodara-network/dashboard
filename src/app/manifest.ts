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
        src: "/newlogo.jpeg",
        sizes: "16x16",
        type: "image/jpeg",
        purpose: "any"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "32x32",
        type: "image/jpeg",
        purpose: "any"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "72x72",
        type: "image/jpeg",
        purpose: "maskable"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "96x96",
        type: "image/jpeg",
        purpose: "maskable"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "128x128",
        type: "image/jpeg",
        purpose: "maskable"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "144x144",
        type: "image/jpeg",
        purpose: "maskable"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "152x152",
        type: "image/jpeg",
        purpose: "maskable"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "384x384",
        type: "image/jpeg",
        purpose: "maskable"
      },
      {
        src: "/newlogo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
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
            src: "/newlogo.jpeg",
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
            src: "/newlogo.jpeg",
            sizes: "96x96"
          }
        ]
      }
    ]
  };
}