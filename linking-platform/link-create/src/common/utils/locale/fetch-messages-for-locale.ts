import { type I18NMessages } from '@atlaskit/intl-messages-provider';

export const fetchMessagesForLocale = async (
  locale: string,
): Promise<I18NMessages | undefined> => {
  try {
    const messages = await import(
      /* webpackChunkName: "@atlaskit-internal_@atlassian/link-create-confluence-i18n-[request]" */ `../../../i18n/${locale.replace(
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
      /* webpackChunkName: "@atlaskit-internal_@atlassian/link-create-confluence-i18n-[request]" */ `../../../i18n/${parentLocale}`
    );
    return messages.default;
  } catch (e) {
    // ignore
  }
};
