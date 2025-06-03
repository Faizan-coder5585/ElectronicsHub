'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store/index.js';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import './globals.css';



export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Paths where Footer should be hidden
  const hideFooterPaths = [
    '/addCart',
    '/address',
    '/orderSummary',
    '/register',
    '/login',
    '/otp',
    '/products',
    '/dummy',
  ];

  const shouldHideFooter = hideFooterPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // PersistGate hydration effect
  useEffect(() => {
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        console.log('Persisted state hydrated:', store.getState());
        unsubscribe();
      }
    });
  }, []);

  return (
    <html lang="en">
      <body className="bg-zinc-200 min-h-screen flex flex-col">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Header />
            <main className="flex-grow">{children}</main>
            {!shouldHideFooter && <Footer />}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
