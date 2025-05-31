'use client';
import 'antd/dist/reset.css';
import '../styles/globals.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ReactQueryProvider from '../components/ReactQueryProvider';
import React from 'react';
import { UserProvider, useUser } from '../context/UserContext';
import { usePathname, useRouter } from 'next/navigation';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname !== '/login';
  const { user, loading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.replace('/login');
    }
    if (!loading && user && pathname === '/login') {
      router.replace('/');
    }
  }, [user, pathname, router, loading]);

  if (loading) return null;
  if (!user && pathname !== '/login') return null;

  return (
    <div style={{gap: '15px'}} className="flex flex-row gap-4">
      <Sidebar />
      <div className="flex flex-col w-full">
        {showHeader && <Header />}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 p-4">
        <UserProvider>
          <ReactQueryProvider>
            <LayoutContent>{children}</LayoutContent>
          </ReactQueryProvider>
        </UserProvider>
      </body>
    </html>
  );
} 