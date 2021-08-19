/** @jsx jsx */
import { useMemo } from 'react';

import { CSSObject, jsx } from '@emotion/core';

import { N80, N900 } from '@atlaskit/theme/colors';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { LabelProps } from '../types';

const fontFamily = getFontFamily();
export const labelCSS = (): CSSObject => ({
  fontFamily: fontFamily,
  alignItems: 'center',
  display: 'flex',
  color: token('color.text.highEmphasis', N900),
  cursor: 'default',
  '&[data-disabled]': {
    color: token('color.text.disabled', N80),
    cursor: 'not-allowed',
  },
});

export default function Label({
  children,
  isDisabled,
  testId,
  onClick,
}: LabelProps) {
  const styles = useMemo(() => labelCSS(), []);
  return (
    <label
      css={styles}
      data-testid={testId}
      data-disabled={isDisabled || undefined}
      onClick={onClick}
    >
      {children}
    </label>
  );
}
