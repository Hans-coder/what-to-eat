import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "今天吃什麼？",
  description: "解決你的選擇困難症",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        ></script>
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`} suppressHydrationWarning>
        <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
