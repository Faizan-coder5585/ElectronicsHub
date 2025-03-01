"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import  store   from '../redux/store/index.js';
import { Provider } from 'react-redux';


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideFooterPaths = ["/addCart", "/address", "/orderSummary", "/register", "/login", "/otp"];

  const shouldHideFooter = hideFooterPaths.some(path => pathname.startsWith(path));
  return (
    <html lang="en">
      <body className="bg-zinc-200">
        <Provider store={store}>
          <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow">
              {children}
            </main>
            
            {!shouldHideFooter && <Footer />}
          </div>
        </Provider>
      </body>
    </html>
  );
}
