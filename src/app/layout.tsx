import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { WalletProvider } from "@/contexts/WalletContext";

export const metadata: Metadata = {
  title: "nodara - Rent Smartphone Compute Power",
  description: "Serverless Functions, Rented From Smartphones Near You. Rent compute power, pay in SOL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}