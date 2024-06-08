import type { Metadata } from "next";
import localFont from "next/font/local";

import {
  ConnectionProvider,
  WalletModalProvider,
  WalletProvider,
} from "@repo/ui/providers";

import "@solana/wallet-adapter-react-ui/styles.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Solana dApp",
  description: "Created with Next.js & Anchor",

  //   const metaTitle = "Solana Clicker";
  // const metaDescription =
  //   "Solana Clicker is an open-source game being developed to learn and demonstrate techniques for integrating with Solana programs and Solana NFTs.";
  // const metaAbsoluteUrl = "https://solana-clicker.netlify.app/";
  // const metaImageUrl = "https://solana-clicker.netlify.app/home.png";
  // <Head>
  //   <title>{metaTitle}</title>
  //   <meta name="title" content={metaTitle} />
  //   <meta name="description" content={metaDescription} />

  //   <meta property="og:type" content="website" />
  //   <meta property="og:title" content={metaTitle} />
  //   <meta property="og:url" content={metaAbsoluteUrl} />
  //   <meta property="og:image" content={metaImageUrl} />
  //   <meta property="og:description" content={metaDescription} />

  //   <meta name="twitter:card" content="summary" />
  //   <meta name="twitter:title" content={metaTitle} />
  //   <meta name="twitter:description" content={metaDescription} />
  //   <meta name="twitter:image" content={metaImageUrl} />
  // </Head>
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConnectionProvider>
          <WalletProvider>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
