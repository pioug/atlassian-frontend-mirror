/** @jsx jsx */
import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import { LabelTextProps } from '../types';

const padding = gridSize() * 0.5;
export const labelTextCSS = {
  paddingRight: padding,
  paddingLeft: padding,
};

export default function LabelText({ children }: LabelTextProps) {
  return <span css={labelTextCSS}>{children}</span>;
}
