import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AppProviders } from "@/components/AppProviders";
import TaskProviderWrapper from "@/components/TaskProviderWrapper";

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
        <AppProviders>
          <TaskProviderWrapper>
            {children}
          </TaskProviderWrapper>
        </AppProviders>
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