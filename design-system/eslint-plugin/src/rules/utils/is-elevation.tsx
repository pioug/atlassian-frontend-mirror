import tokens from '@atlaskit/tokens/token-names';

const legacyElevation: Record<
  string,
  { background: keyof typeof tokens; shadow: keyof typeof tokens }
> = {
  e100: {
    background: 'color.background.card',
    shadow: 'shadow.card',
  },
  e200: {
    background: 'color.background.overlay',
    shadow: 'shadow.overlay',
  },
  e300: {
    background: 'color.background.overlay',
    shadow: 'shadow.overlay',
  },
  e400: {
    background: 'color.background.overlay',
    shadow: 'shadow.overlay',
  },
  e500: {
    background: 'color.background.overlay',
    shadow: 'shadow.overlay',
  },
};

export const isLegacyElevation = (name: string) => {
  if (Object.keys(legacyElevation).includes(name)) {
    return legacyElevation[name];
  }

  return false;
};
