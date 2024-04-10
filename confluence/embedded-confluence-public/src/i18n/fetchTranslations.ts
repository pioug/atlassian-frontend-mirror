const importTranslations = async (
  locale: string,
): Promise<{ default: Record<string, string> }> => {
  // At the time of writing (04/04/2024) there are no I18n translations in this package.
  // If translations are added to the package the following switch statement will need
  // to be updated to include the other locales. See embedded-confluence-common for an
  // example of what this should look like.

  switch (locale) {
    case 'en-US':
      return import(
        /* webpackChunkName: "@atlaskit-internal_embedded-confluence-public-i18n-en" */ './en'
      );
    case 'en-GB':
      return import(
        /* webpackChunkName: "@atlaskit-internal_embedded-confluence-public-i18n-en_GB" */ './en_GB'
      );
    default:
      return Promise.resolve({ default: {} });
  }
};

const fetchTranslations = async (
  locale: string,
): Promise<Record<string, string>> => {
  const module = await importTranslations(locale);
  return module.default;
};

export default fetchTranslations;
