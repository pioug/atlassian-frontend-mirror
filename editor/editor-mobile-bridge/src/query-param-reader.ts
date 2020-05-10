export const getQueryParams = () => new URLSearchParams(window.location.search);

export const getModeValue = (): 'dark' | 'light' => {
  const params = getQueryParams();
  const input: unknown = params.get('mode');
  switch (input) {
    case 'dark':
    case 'light':
      return input;
    case null:
      return 'light';
    default:
      throw new Error(
        `Could not determine mode for input ${JSON.stringify(input)}`,
      );
  }
};

export const getEnableQuickInsertValue = (): boolean =>
  getQueryParams().get('enableQuickInsert') === 'true';

export const getDisableActionsValue = (): boolean =>
  getQueryParams().get('disableActions') === 'true';

export const getLocaleValue = (): string => {
  const locale = getQueryParams().get('locale');
  if (!locale) {
    return 'en';
  }
  return locale.replace('-', '_');
};

export const getDisableMediaLinkingValue = (): boolean =>
  getQueryParams().get('disableMediaLinking') === 'true';
