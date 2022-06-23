/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import Box from './box';

interface StackProps {
  children: ReactNode;
}

/**
 * __Stack__
 *
 * A Stack {description}.
 *
 * @internal
 */
function Stack({ children }: StackProps) {
  return <Box>{children}</Box>;
}

export default Stack;
