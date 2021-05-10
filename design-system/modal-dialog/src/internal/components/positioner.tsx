/** @jsx jsx */

import React, { ReactNode, useMemo } from 'react';

import { jsx } from '@emotion/core';

import { WidthNames } from '../constants';
import {
  getPositionAbsoluteStyles,
  getPositionFixedStyles,
  getPositionRelativeStyles,
} from '../styles/modal';
import { ScrollBehavior } from '../types';

export interface PositionerProps {
  scrollBehavior: ScrollBehavior;
  stackIndex: number;
  widthName?: WidthNames;
  widthValue?: string | number;
  children: ReactNode;
  testId?: string;
}

const Positioner: React.ComponentType<PositionerProps> = function Positioner({
  scrollBehavior,
  stackIndex,
  widthName,
  widthValue,
  children,
  testId,
}: PositionerProps) {
  const positionerStyles = useMemo(() => {
    const opts = { stackIndex, widthName, widthValue };
    switch (scrollBehavior) {
      case 'outside':
        return getPositionRelativeStyles(opts);
      case 'inside-wide':
        return getPositionFixedStyles(opts);
      default:
        return getPositionAbsoluteStyles(opts);
    }
  }, [scrollBehavior, stackIndex, widthName, widthValue]);

  return (
    <div css={positionerStyles} data-testid={testId && `${testId}--positioner`}>
      {children}
    </div>
  );
};

Positioner.displayName = 'Positioner';
export default Positioner;
