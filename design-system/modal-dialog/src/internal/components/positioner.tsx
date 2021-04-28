import React from 'react';

import { WidthNames } from '../constants';
import {
  PositionerAbsolute,
  PositionerFixed,
  PositionerRelative,
} from '../styles/modal';
import { ScrollBehavior } from '../types';

export interface PositionerProps {
  scrollBehavior: ScrollBehavior;
  style: Object;
  widthName?: WidthNames;
  widthValue?: string | number;
}

const Positioner: React.ComponentType<PositionerProps> = function Positioner({
  scrollBehavior,
  ...props
}: PositionerProps) {
  // default 'inside'
  let PositionComponent = PositionerAbsolute;
  if (scrollBehavior === 'outside') {
    PositionComponent = PositionerRelative;
  } else if (scrollBehavior === 'inside-wide') {
    PositionComponent = PositionerFixed;
  }

  return <PositionComponent {...props} />;
};

export default Positioner;
