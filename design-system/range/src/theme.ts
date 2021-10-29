import * as colors from '@atlaskit/theme/colors';
import { createTheme } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

export interface ThemeTokensThumb {
  background: string;
  border?: string;
}

export interface ThemeTokensTrack {
  lower: string;
  upper: string;
}

export interface ThemeTokens {
  thumb: {
    default: ThemeTokensThumb;
    disabled: { boxShadow: string };
    focus: ThemeTokensThumb;
  };
  track: {
    default: ThemeTokensTrack;
    disabled: ThemeTokensTrack;
    hover: ThemeTokensTrack;
  };
}

export const thumb = {
  default: {
    background: token('color.background.card', colors.N0),
  },
  disabled: {
    boxShadow: token('shadow.card', `0 0 1px ${colors.N60A}`),
  },
  focus: {
    background: token('color.background.boldNeutral.resting', colors.N0),
    border: token('color.border.focus', colors.B200),
  },
};

export const track = {
  default: {
    lower: token('color.background.boldBrand.resting', colors.B400),
    upper: token('color.background.subtleNeutral.resting', colors.N30),
  },
  disabled: {
    lower: token('color.text.disabled', colors.N50),
    upper: token('color.background.disabled', colors.N30),
  },
  hover: {
    lower: token('color.background.boldBrand.hover', colors.B300),
    upper: token('color.background.subtleNeutral.hover', colors.N40),
  },
};

export const Theme = createTheme<ThemeTokens, any>(() => ({
  thumb,
  track,
}));
