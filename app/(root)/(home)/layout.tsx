import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ClientProviders from '@/components/ClientProviders';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Ro0m',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <ClientProviders>
      <main className="relative bg-bg-primary min-h-screen">
        <Navbar />

        <div className="flex">
          <Sidebar />
          
          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-10 lg:px-14">
            <div className="w-full max-w-[1400px] mx-auto">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </section>
        </div>
      </main>
    </ClientProviders>
  );
};

export default RootLayout;

