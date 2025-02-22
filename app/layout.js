import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const activeFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "MongoDB Manager",
  description:
    "MongoDB Manager helps you manage your MongoDB databases via a web GUI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="h-full">
      <body className={`${activeFont.className} h-full flex flex-col`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
