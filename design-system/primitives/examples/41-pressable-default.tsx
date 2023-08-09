import React from 'react';

import UNSAFE_PRESSABLE from '../src/components/pressable';

export default function Default() {
  return (
    <UNSAFE_PRESSABLE
      testId="pressable-default"
      onClick={() => alert('Pressed')}
    >
      Press me
    </UNSAFE_PRESSABLE>
  );
}
