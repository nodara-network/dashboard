import type { MetadataRoute } from "next";

const { appName, description } = {
  appName: "Nodara Network",
  description:
    "Nodara Network powers the decentralized future with robust Web3 infrastructure. Explore our solutions in blockchain scaling, validator services, and developer tools for decentralized applications. Join the movement to build a more secure, permissionless internet.",
};

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}