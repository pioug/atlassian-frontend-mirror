import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

const titleFontWeight = '600';

export const titleBlockStyles = css`
  justify-content: center;
  font-weight: ${titleFontWeight};
  margin-top: ${token('space.100', '8px')};
`;

export const mainTextStyles = css`
  display: inline;
  justify-content: center;
  margin-top: ${token('space.0', '0px')};
  font-size: 0.75rem;
  text-align: center;
`;

export const connectButtonStyles = css`
  justify-content: center;
  margin-top: ${token('space.100', '8px')};
`;
