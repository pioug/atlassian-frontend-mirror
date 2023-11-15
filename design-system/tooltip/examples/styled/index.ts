import styled from '@emotion/styled';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const color: { [key: string]: string } = {
  blue: colors.B300,
  green: colors.G300,
  neutral: colors.N100,
  purple: colors.P300,
  red: colors.R300,
  teal: colors.T300,
  yellow: colors.Y300,
};

export type Color =
  | 'blue'
  | 'green'
  | 'neutral'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';

interface StyledProps {
  pad?: string;
  position?: string;
  color: Color | string;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Target = styled.button<StyledProps>`
  background-color: ${(p) =>
    color[p.color] || token('color.background.brand.bold', colors.B400)};
  border-radius: 3px;
  border: 0;
  box-sizing: initial;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-size: inherit;
  height: 30px;
  line-height: 30px;
  padding: 0 1em;
  user-select: none;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const BigTarget = styled.button<StyledProps>`
  background-color: ${(p) =>
    color[p.color] || token('color.background.brand.bold', colors.B400)};
  border-radius: 3px;
  border: 0;
  box-sizing: initial;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: inherit;
  line-height: unset;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 150px;
  padding: 0 1em;
  user-select: none;
  text-align: center;
`;
