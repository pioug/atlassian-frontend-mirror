import messages from '../../../../i18n/en';

import { I18NMessages } from './types';

export const fetchMessagesForLocale = async (
  locale: string,
): Promise<I18NMessages | undefined> => {
  try {
    const messages = await import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-[request]" */ `../../../../i18n/${locale.replace(
        '-',
        '_',
      )}`
    );
    return messages.default;
  } catch (e) {
    // ignore
  }

  try {
    const parentLocale = locale.split(/[-_]/)[0];
    const messages = await import(
      /* webpackChunkName: "@atlaskit-internal_link-picker-i18n-[request]" */ `../../../../i18n/${parentLocale}`
    );
    return messages.default;
  } catch (e) {
    // ignore
  }

  /**
   * English bundled by default as this is the majority of users
   */
  return messages;
};
