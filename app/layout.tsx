import { Inter } from 'next/font/google';
import './globals.css';
import { AppKitProvider } from '@/providers/AppKitProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  );
} 