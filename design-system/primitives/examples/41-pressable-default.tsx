import React from 'react';

import { Pressable } from '../src';

export default function Default() {
  return (
    <Pressable testId="pressable-default" onClick={() => alert('Pressed')}>
      Press me
    </Pressable>
  );
}
