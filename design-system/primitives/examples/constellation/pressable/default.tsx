import React from 'react';

import Pressable from '@atlaskit/primitives/pressable';

export default function Default() {
  return <Pressable onClick={() => alert('Pressed')}>Pressable</Pressable>;
}
