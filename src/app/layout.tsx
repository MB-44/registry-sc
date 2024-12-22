import type { Metadata } from "next";
import NavigationBar from "./components/navBar/navBar";
import "./globals.css";
// import { Geist, Geist_Mono } from "next/font/google";


// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Wedding Registry",
  description: "By Spa Ceylon, Sri Lanka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body>
        <div>
          <NavigationBar/>
          <main style={{marginTop: "50px", width:"100%"}}>{children}</main>
        </div>
      </body>
    </html>
  );
}
