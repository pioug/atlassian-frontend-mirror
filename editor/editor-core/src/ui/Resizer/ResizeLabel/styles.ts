import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { B300 } from '@atlaskit/theme/colors';

export const wrapper = css`
  font-size: ${token('font.size.100', '14px')};
  width: 100%;
  text-align: center;
  position: absolute;
  transform: translateY(-125%);
  top: 0;
`;

export const text = css`
  display: inline-block;
  border-radius: 6px;
  min-width: 75px;
  background-color: ${token('color.text.accent.blue', B300)};
  color: ${token('color.text.inverse', 'white')};
  padding: ${token('space.050', '4px')} ${token('space.200', '16px')};
  letter-spacing: 0.5px;
`;

export const smallText = css`
  letter-spacing: -0.5px;
  font-size: ${token('font.size.050', '8px')};
  min-width: 27px;
  padding: ${token('space.0', '0px')} ${token('space.025', '2px')};
`;
