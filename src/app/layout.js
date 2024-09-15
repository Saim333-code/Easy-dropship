// "use client"
// import { Roboto } from "next/font/google";
// import "./globals.css";
// import Navbar from  "./components/navbar";
// import { Providers } from "./statemanagement/providers";
// import ToastProvider from "./components/toast";
// import Footer from "./components/footer";
// import "tw-elements-react/dist/css/tw-elements-react.min.css";
// import Head from "next/head";
// import { useEffect } from "react";
// const roboto = Roboto({ weight: "400", subsets: ["latin"] });

// export const metadata = {
//   title: "Easy Dropship",
//   description: "Simplify Your E-Commerce Journey",
// };

// export default function RootLayout({ children }) {
//   useEffect(() => {
//     // Ensure the Meta Pixel script is added once
//     if (window.fbq) return;

//     !function(f,b,e,v,n,t,s) {
//       if(f.fbq) return;
//       n=f.fbq=function() {
//         n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
//       };
//       if(!f._fbq) f._fbq=n;
//       n.push=n;
//       n.loaded=!0;
//       n.version='2.0';
//       n.queue=[];
//       t=b.createElement(e);
//       t.async=!0;
//       t.src=v;
//       s=b.getElementsByTagName(e)[0];
//       s.parentNode.insertBefore(t,s);
//     }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

//     fbq('init', '885143986858852'); // Your Meta Pixel ID
//     fbq('track', 'PageView');
//   }, []);

//   return (
//     <html lang="en">
//        <Head>
//         {/* Meta Pixel Base Code */}
//         <noscript>
//           <img height="1" width="1" style={{ display: 'none' }}
//                src="https://www.facebook.com/tr?id=885143986858852&ev=PageView&noscript=1" />
//         </noscript>
//       </Head>
//       <body className={roboto.className}>
//         <Providers>
//         <ToastProvider>
//         <Navbar/>
//         {children}
//         <Footer/>
//         </ToastProvider>
//         </Providers>
//         </body>
//     </html>
//   );
// }
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { Providers } from "./statemanagement/providers";
import ToastProvider from "./components/toast";
import Footer from "./components/footer";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import { Metadata } from "next";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Easy Dropship",
  description: "Simplify Your E-Commerce Journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Base Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s) {
                if(f.fbq) return;
                n=f.fbq=function() {
                  n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
                };
                if(!f._fbq) f._fbq=n;
                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];
                t=b.createElement(e);
                t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s);
              }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '885143986858852'); // Your Meta Pixel ID
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
               src="https://www.facebook.com/tr?id=885143986858852&ev=PageView&noscript=1" />
        </noscript>
      </head>
      <body className={roboto.className}>
        <Providers>
          <ToastProvider>
            <Navbar />
            {children}
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

