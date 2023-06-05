import { css, keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import type { ThemeAppearance } from '@atlaskit/lozenge';

const pulseKeyframes = keyframes`
  to {
    box-shadow: 0 0 0 7px rgba(0, 0, 0, 0);
  }
`;

const getPulseColor = (appearance?: ThemeAppearance) => {
  switch (appearance) {
    case 'inprogress':
      return token('color.background.information.bold', '#0052CC');
    case 'moved':
      return token('color.background.warning.bold', '#FFAB00');
    case 'new':
      return token('color.background.discovery.bold', '#5243AA');
    case 'removed':
      return token('color.background.danger.bold', '#DE350B');
    case 'success':
      return token('color.background.success.bold', '#00875A');
    case 'default':
    default:
      return token('color.background.neutral.bold', '#42526E');
  }
};

export const getPulseStyles = (appearance?: ThemeAppearance) => css`
  display: inline-flex;
  border-radius: 3px;
  box-shadow: 0 0 0 0 ${getPulseColor(appearance)};
  animation: ${pulseKeyframes} 1.45s cubic-bezier(0.5, 0, 0, 1) 3;
`;
