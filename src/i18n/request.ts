import { getRequestConfig } from 'next-intl/server';
import { locales } from './navigation';

export default getRequestConfig(async ({ locale }) => {
  console.log('Received locale:', locale);
  console.log('Available locales:', locales);
  console.log('Type of locale:', typeof locale);
  console.log('Is locale in locales?', locales.includes(locale as typeof locales[number]));

  // Default to 'en' if locale is undefined or not in the list
  const validLocale = locale && locales.includes(locale as typeof locales[number]) ? locale : 'en';
  console.log('Using locale:', validLocale);

  const messages = (await import(`../../messages/${validLocale}.json`)).default;
  console.log('Successfully loaded messages for locale:', validLocale);

  return {
    messages,
    timeZone: 'UTC',
    now: new Date(),
    locale: validLocale
  };
}); 