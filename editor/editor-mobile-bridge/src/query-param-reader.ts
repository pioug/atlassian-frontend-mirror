export const getQueryParams = () => new URLSearchParams(window.location.search);

export const getAllowCollabProvider = (): boolean =>
  getQueryParams().get('allowCollabProvider') === 'true';

export const getEnableLightDarkTheming = (): boolean =>
  getQueryParams().get('enableLightDarkTheming') === 'true';

export const getEnableTokenThemes = (): boolean =>
  getQueryParams().get('enableTokenThemes') === 'true';

export const getEnableLegacyMobileMacros = (): boolean =>
  getQueryParams().get('enableLegacyMobileMacros') === 'true';

export const getAllowCaptions = (): boolean => {
  return getQueryParams().get('allowCaptions') === 'true';
};

export const getAllowMediaInline = (): boolean => {
  return getQueryParams().get('allowMediaInline') === 'true';
};

export const getSelectionObserverEnabled = (): boolean =>
  getQueryParams().get('selectionObserverEnabled') === 'true';

export const getMediaImageResize = (): boolean => {
  return getQueryParams().get('enableMediaResize') === 'true';
};
