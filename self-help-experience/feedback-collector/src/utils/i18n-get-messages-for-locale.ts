/**
 * Tries to get the most specific messages bundle for a given locale.
 *
 * Strategy:
 * 1. Try to find messages with the exact string (i.e. 'fr_FR')
 * 2. If that doesn't work, try to find messages for the country locale (i.e. 'fr')
 * 3. If that doesn't work, return english messages as a fallback.
 *
 * @param locale string specifying the locale like 'en_GB', or 'fr'.
 */

export const getMessagesForLocale = async (locale: string) => {
  locale = locale.replace('-', '_');
  try {
    const messages = await import(
      /* webpackChunkName: "@atlaskit-internal_feedback-collector/i18n-tranlations" */ `../i18n/${locale}`
    );
    return messages.default;
  } catch (e) {
    // ignore
  }
  try {
    const parentLocale = locale.split(/[-_]/)[0];

    const messages = await import(
      /* webpackChunkName: "@atlaskit-internal_feedback-collector/i18n-tranlations" */ `../i18n/${parentLocale}`
    );
    return messages.default;
  } catch (e) {
    // ignore
  }
};
