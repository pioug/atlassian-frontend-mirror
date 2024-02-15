/** @jsx jsx */

import type { FC } from 'react';

import { jsx } from '@emotion/react';

import { wrapperStyle } from './wrapper';

interface FrameViewProps {
  children?: React.ReactNode;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

export const Frame: FC<FrameViewProps> = ({ children, testId }) => (
  <span css={wrapperStyle} data-testid={testId}>
    {children}
  </span>
);
