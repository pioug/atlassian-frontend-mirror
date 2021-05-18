/** @jsx jsx */

import React, { ReactNode, useMemo } from 'react';

import { jsx } from '@emotion/core';

import {
  getPositionAbsoluteStyles,
  getPositionFixedStyles,
  getPositionRelativeStyles,
} from '../styles/modal';
import { ScrollBehavior } from '../types';

export interface PositionerProps {
  scrollBehavior: ScrollBehavior;
  stackIndex: number;
  children: ReactNode;
  testId?: string;
}

const Positioner: React.ComponentType<PositionerProps> = function Positioner({
  scrollBehavior,
  stackIndex,
  children,
  testId,
}: PositionerProps) {
  const positionerStyles = useMemo(() => {
    switch (scrollBehavior) {
      case 'outside':
        return getPositionRelativeStyles(stackIndex);
      case 'inside-wide':
        return getPositionFixedStyles(stackIndex);
      default:
        return getPositionAbsoluteStyles(stackIndex);
    }
  }, [scrollBehavior, stackIndex]);

  return (
    <div css={positionerStyles} data-testid={testId && `${testId}--positioner`}>
      {children}
    </div>
  );
};

Positioner.displayName = 'Positioner';
export default Positioner;
