/** @jsx jsx */

import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { ChromeColors } from '../../../types';

import { beforeElementStyles, roundedBorderStyles } from './styles';

interface BeforeProps {
  elemBefore?: ReactNode;
  isRounded: boolean;
  styles: ChromeColors;
}

const Before = ({ elemBefore, isRounded, styles }: BeforeProps) =>
  elemBefore ? (
    <span
      css={[
        beforeElementStyles(styles),
        isRounded ? roundedBorderStyles : undefined,
      ]}
    >
      {elemBefore}
    </span>
  ) : null;

export default Before;
