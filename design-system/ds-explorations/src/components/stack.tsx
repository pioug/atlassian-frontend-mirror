/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { GlobalSpacingToken } from '../constants';

import Box from './box.partial';

interface StackProps {
  gap: GlobalSpacingToken;
  children: ReactNode;
}

/**
 * __Stack__
 *
 * A Stack {description}.
 *
 * @internal
 */
function Stack({ gap, children }: StackProps) {
  return (
    <Box flexDirection="column" gap={gap}>
      {children}
    </Box>
  );
}

export default Stack;
