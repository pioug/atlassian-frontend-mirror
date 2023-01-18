/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import {
  B200,
  B400,
  N0,
  N100,
  N400,
  N50,
  N600,
  N800,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// TODO: This is where we need to add tokens for all appearance color values
export const getColorsFromAppearance = (appearance?: string) => {
  let iconGradientStart,
    iconGradientStop,
    iconColor,
    textColor,
    atlassianLogoTextColor;

  switch (appearance) {
    case 'brand':
      iconGradientStart = B400;
      iconGradientStop = B200;
      iconColor = B200;
      textColor = token('color.text', N800);
      // This is only used for the top level Atlassian wordmark (see AtlassianLogo
      // or AtlassianStartLogo for example), and is only different for the Brand
      // appearance - a bold brand color. For other appearances,
      // atlassianLogoTextColor is the same as textColor.
      atlassianLogoTextColor = B400;
      break;
    case 'neutral':
      iconGradientStart = N600;
      iconGradientStop = N100;
      iconColor = N100;
      textColor = N400;
      atlassianLogoTextColor = N400;
      break;
    case 'inverse':
      iconGradientStart = N50;
      iconGradientStop = N0;
      iconColor = N0;
      textColor = token('color.text.inverse', N0);
      atlassianLogoTextColor = token('color.text.inverse', N0);
      break;
  }

  return {
    iconGradientStart,
    iconGradientStop,
    iconColor,
    textColor,
    atlassianLogoTextColor,
  };
};
