"use client";

import Script from "next/script";

const GA_TRACKING_ID = "G-1FLMZMH3L5";

export const GoogleAnalytics = () => {
  return (
    <>
      <Script defer src="https://cloud.umami.is/script.js" data-website-id="96b34115-fcef-47ad-ad18-386a7c6b1cf6" />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={() => {
          //@ts-ignore
          window.dataLayer = window.dataLayer || [];

          //@ts-ignore
          function gtag() {
            // @ts-ignore
            // eslint-disable-next-line
            dataLayer.push(arguments);
          }

          //@ts-ignore
          gtag("js", new Date());

          //@ts-ignore
          gtag("config", GA_TRACKING_ID);
        }}
      />
    </>
  );
};