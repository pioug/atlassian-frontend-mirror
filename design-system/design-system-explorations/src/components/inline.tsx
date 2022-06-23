/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import Box from './box';

interface InlineProps {
  children: ReactNode;
}

/**
 * __Inline__
 *
 * A Inline {description}.
 *
 * @internal
 */
function Inline({ children }: InlineProps) {
  return <Box>{children}</Box>;
}

export default Inline;
