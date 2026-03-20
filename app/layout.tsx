import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import '@/styles/globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Zeitgeist',
    default: 'Zeitgeist Intelligence Dashboard',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className="h-full dark" suppressHydrationWarning>
      <body
        className={cn(
          'antialiased flex h-full text-base text-foreground bg-background',
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          storageKey="zeitgeist-theme"
          disableTransitionOnChange
          enableColorScheme
        >
          <TooltipProvider delayDuration={0}>
            <Suspense>{children}</Suspense>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>       
      </body>
    </html>
  );
}
