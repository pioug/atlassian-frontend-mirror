export const normalizeLocale = (locale: string): string =>
  locale.replace(/_/g, '-');
