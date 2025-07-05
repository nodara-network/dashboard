import { JetBrains_Mono } from "next/font/google";

const jetBrains = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const logoFont = jetBrains.className;