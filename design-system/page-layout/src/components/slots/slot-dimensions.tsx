import React from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { UNSAFE_media } from '@atlaskit/primitives/responsive';

interface SlotDimensionsProps {
  variableName: string;
  value?: number;
  mobileValue?: number;
}

export default ({ variableName, value, mobileValue }: SlotDimensionsProps) => (
  <style>
    {`:root{--${variableName}:${value}px;}`}
    {getBooleanFF(
      'platform.design-system-team.responsive-page-layout-left-sidebar_p8r7g',
    ) &&
      mobileValue &&
      `${UNSAFE_media.below.md} { :root{--${variableName}:${mobileValue}px;} }`}
  </style>
);
