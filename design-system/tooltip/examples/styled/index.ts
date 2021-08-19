/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import styled from '@emotion/styled';

import * as colors from '@atlaskit/theme/colors';

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

export const Target = styled.div<StyledProps>`
  background-color: ${(p) => color[p.color] || colors.primary};
  border-radius: 3px;
  color: white;
  cursor: pointer;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding-left: 1em;
  padding-right: 1em;
  user-select: none;
`;

export const BigTarget = styled.div<StyledProps>`
  background-color: ${(p) => color[p.color] || colors.primary};
  border-radius: 3px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 150px;
  padding-left: 1em;
  padding-right: 1em;
  user-select: none;
  text-align: center;
`;
