import * as i18nMessages from '../src/i18n';

export const locales = {
  ...i18nMessages,
  // Append the 'en' locale, so it is selectable in our picker
  en: {},
};

export type Locale = keyof typeof locales;
