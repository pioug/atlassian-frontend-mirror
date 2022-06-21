/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { LabelTextProps } from '../types';

const labelTextStyles = css({
  alignSelf: 'center',
  gridArea: '1 / 2 / 2 / 3',
});

export default function LabelText({ children }: LabelTextProps) {
  return <span css={labelTextStyles}>{children}</span>;
}
