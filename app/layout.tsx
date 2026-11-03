import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Groww Mutual Funds · SIP Companion (POC)',
  description: 'Eval-gated AI feature inside Groww Mutual Funds dashboard for first-year SIP investor retention.',
  icons: {
    icon: '/groww-mark.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-[#1E222B] antialiased">
        {children}
      </body>
    </html>
  );
}

