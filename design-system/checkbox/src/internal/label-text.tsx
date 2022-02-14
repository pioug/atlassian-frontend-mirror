/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { LabelTextProps } from '../types';

import { gridSize } from './constants';

const labelTextStyles = css({
  paddingRight: 0.5 * gridSize,
  paddingLeft: 0.5 * gridSize,
});

export default function LabelText({ children }: LabelTextProps) {
  return <span css={labelTextStyles}>{children}</span>;
}
