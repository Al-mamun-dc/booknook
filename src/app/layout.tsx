import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const josefinSans = Josefin_Sans({
 
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "BookNook — Discover Great Books",
  description: "Discover, borrow, and track great books.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${josefinSans.className}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
         <Navbar />
        {children}
         <Footer className="mt-auto" />
         <ToastContainer position="top-right" autoClose={2500} />
        
        </body>
    </html>
  );
}
