import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./reference-theme.css";
import "./icons.css";
import "./studio-workflows.css";
import "./display-numerals.css";
import "./interactions.css";
const urbanist = localFont({
  src: "../../public/fonts/Urbanist-Variable.ttf",
  variable: "--font-urbanist",
  weight: "100 900",
  display: "swap",
});
const matricha = localFont({
  src: "../../public/fonts/Matricha-Regular.woff",
  variable: "--font-matricha",
  weight: "400",
  display: "swap",
});
const robotoCondensed = localFont({
  src: "../../public/fonts/RobotoCondensed-Variable.ttf",
  weight: "100 900",
  style: "normal",
  variable: "--font-roboto-condensed",
  display: "swap",
});
export const metadata:Metadata={title:"iGYM — Form Dashboard",description:"Your gym owner workspace.",robots:{index:false,follow:false}};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${urbanist.variable} ${robotoCondensed.variable} ${matricha.variable}`}>
      <body>{children}</body>
    </html>
  );
}
