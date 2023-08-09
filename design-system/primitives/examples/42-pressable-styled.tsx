import React from 'react';

import { xcss } from '../src';
import UNSAFE_PRESSABLE from '../src/components/pressable';

const pressableStyles = xcss({
  borderRadius: 'border.radius.100',
  color: 'color.text.inverse',
});

export default function Styled() {
  return (
    <UNSAFE_PRESSABLE
      testId="pressable-styled"
      backgroundColor="color.background.brand.bold"
      padding="space.100"
      xcss={pressableStyles}
    >
      Press me
    </UNSAFE_PRESSABLE>
  );
}
