import React from 'react';

import { WidthNames } from '../shared-variables';
import { PositionerAbsolute, PositionerRelative } from '../styled/Modal';

export interface PositionerProps {
  scrollBehavior: void | 'inside' | 'outside';
  style: Object;
  widthName?: WidthNames;
  widthValue?: string | number;
}

const Positioner: React.ComponentType<PositionerProps> = function Positioner({
  scrollBehavior,
  ...props
}: PositionerProps) {
  const PositionComponent =
    scrollBehavior === 'inside' ? PositionerAbsolute : PositionerRelative;

  return <PositionComponent {...props} />;
};

export default Positioner;
