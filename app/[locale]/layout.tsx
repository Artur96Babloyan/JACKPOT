import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n/navigation';import { Providers } from '@/components/providers';

export function generateStaticParams() {
  console.log('Generating static params for locales:', locales);
  return locales.map((locale) => {
    console.log('Generating params for locale:', locale);
    return { locale };
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log('Layout received locale:', locale);
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
    console.log('Successfully loaded messages for locale:', locale);
  } catch (error) {
    console.error('Error loading messages:', error);
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <div className="min-h-screen bg-gray-900">
          <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                Jackpot
              </h1>
            </div>
          </header>
          <main className="container mx-auto px-4 pt-24 pb-8">
            {children}
          </main>
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
} 