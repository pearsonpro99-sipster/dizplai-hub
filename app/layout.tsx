// app/layout.tsx — Root layout
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dizplai Hub",
  description: "Interactive fan engagement hubs powered by Dizplai",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0D0D15] text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}