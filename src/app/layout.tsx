import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plantiaio",
  description: "A plant community for sharing plant notes, tracking plants, getting AI-assisted care insights, and exploring plant guides."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
