import tokens from '@atlaskit/tokens/token-names';

const legacyElevation: Record<
  string,
  { background: keyof typeof tokens; shadow: keyof typeof tokens }
> = {
  e100: {
    background: 'elevation.backgroundCard',
    shadow: 'elevation.shadowCard',
  },
  e200: {
    background: 'elevation.backgroundOverlay',
    shadow: 'elevation.shadowOverlay',
  },
  e300: {
    background: 'elevation.backgroundOverlay',
    shadow: 'elevation.shadowOverlay',
  },
  e400: {
    background: 'elevation.backgroundOverlay',
    shadow: 'elevation.shadowOverlay',
  },
  e500: {
    background: 'elevation.backgroundOverlay',
    shadow: 'elevation.shadowOverlay',
  },
};

export const isLegacyElevation = (name: string) => {
  const elevation = legacyElevation[name];
  if (elevation) {
    return elevation;
  }

  return false;
};
