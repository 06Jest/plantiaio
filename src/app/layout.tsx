import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plant Tracker",
  description: "Private, owner-controlled plant care tracking."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
