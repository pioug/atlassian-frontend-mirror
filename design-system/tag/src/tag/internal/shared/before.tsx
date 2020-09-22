/** @jsx jsx */

import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { beforeElementStyles, roundedBorderStyles } from './styles';

interface BeforeProps {
  elemBefore?: ReactNode;
  isRounded: boolean;
}

const Before = ({ elemBefore, isRounded }: BeforeProps) =>
  elemBefore ? (
    <span
      css={[beforeElementStyles, isRounded ? roundedBorderStyles : undefined]}
    >
      {elemBefore}
    </span>
  ) : null;

export default Before;
