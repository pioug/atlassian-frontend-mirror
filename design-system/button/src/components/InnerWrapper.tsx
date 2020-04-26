/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

interface Props {
  children: React.ReactNode;
  fit: boolean;
  onClick?: React.MouseEventHandler;
  testId?: string;
}

export default ({ fit, children, ...rest }: Props) => (
  <span
    css={{
      alignSelf: 'center',
      display: 'inline-flex',
      flexWrap: 'nowrap',
      maxWidth: '100%',
      position: 'relative',
      ...(fit && { width: '100%' }),
      ...(fit && { justifyContent: 'center' }),
    }}
    {...rest}
  >
    {children}
  </span>
);
