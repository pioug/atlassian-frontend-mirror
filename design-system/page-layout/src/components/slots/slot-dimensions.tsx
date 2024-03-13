import React from 'react';

import { UNSAFE_media } from '@atlaskit/primitives/responsive';

interface SlotDimensionsProps {
  variableName: string;
  value?: number;
  mobileValue?: number;
}

export default ({ variableName, value, mobileValue }: SlotDimensionsProps) => (
  <style>
    {`:root{--${variableName}:${value}px;}`}
    {mobileValue &&
      `${UNSAFE_media.below.sm} { :root{--${variableName}:${mobileValue}px;} }`}
  </style>
);
