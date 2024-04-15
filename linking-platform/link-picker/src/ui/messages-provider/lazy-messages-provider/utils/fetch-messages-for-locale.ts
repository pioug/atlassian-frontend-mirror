import { I18NMessages } from '@atlaskit/intl-messages-provider';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { locales } from '../../../../i18n';

export const fetchMessagesForLocale = async (
  locale: string,
): Promise<I18NMessages | undefined> => {
  if (getBooleanFF('platform.linking-platform.link-picker.translations-map')) {
    try {
      const localeKey = locale.replace('-', '_');
      if (localeKey in locales) {
        const messages = await locales[localeKey]();
        return messages.default;
      }
    } catch (e) {
      // ignore
    }

    try {
      const parentLocale = locale.split(/[-_]/)[0];
      if (parentLocale in locales) {
        const messages = await locales[parentLocale]();
        return messages.default;
      }
    } catch (e) {
      // ignore
    }
  } else {
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
  }
};
