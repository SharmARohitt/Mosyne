import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/lib/wallet/provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'MOSYNE | Collective On-Chain Memory Engine',
  description: 'Transform historical on-chain behavior into reusable intelligence at transaction-signing time',
  keywords: ['Web3', 'Blockchain', 'Memory', 'MetaMask', 'Envio', 'Security', 'Analytics'],
  authors: [{ name: 'MOSYNE Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <WalletProvider>
          <div className="cyber-grid" />
          <div className="fixed inset-0 bg-gradient-to-br from-mosyne-dark via-mosyne-darker to-mosyne-dark pointer-events-none" />
          <div className="fixed inset-0 hexagon-pattern pointer-events-none opacity-50" />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
