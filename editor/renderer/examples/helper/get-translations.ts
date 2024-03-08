/* eslint-disable import/dynamic-import-chunkname */
export const getTranslations = async (locale: string) => {
  let messages = {};
  if (!locale.includes('en')) {
    // duplicated in platform/packages/editor/editor-core/example-helpers/get-translations.ts
    messages = await Promise.all([
      import(`../../../editor-core/src/i18n/${locale}`),
      import(`../../../../elements/mention/src/i18n/${locale}`),
      import(`../../../../elements/status/src/i18n/${locale}`),
      import(`../../../editor-common/src/i18n/${locale}`),
    ]).then((modules) =>
      modules.reduce(
        (combined, module) => ({ ...combined, ...module.default }),
        {},
      ),
    );
  }
  return messages;
};
