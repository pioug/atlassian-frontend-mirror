export const geti18NMessages = async (
  localeFileName: string,
): Promise<Object> => {
  return await Promise.all([
    import(`@atlaskit/editor-core/src/i18n/${localeFileName}`),
    import(`@atlaskit/mention/src/i18n/${localeFileName}`),
  ]).then((args) =>
    args.reduce((acc, current) => ({ ...acc, ...current.default }), {}),
  );
};
