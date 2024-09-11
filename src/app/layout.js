import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from  "./components/navbar";
import { Providers } from "./statemanagement/providers";
import ToastProvider from "./components/toast";
import Footer from "./components/footer";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Easy Dropship",
  description: "Simplify Your E-Commerce Journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={roboto.className}>
        <Providers>
        <ToastProvider>
        <Navbar/>
        {children}
        <Footer/>
        </ToastProvider>
        </Providers>
        </body>
    </html>
  );
}
