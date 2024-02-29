import React from 'react';

import { xcss } from '@atlaskit/primitives';
import Pressable from '@atlaskit/primitives/pressable';

const pressableStyles = xcss({
  color: 'color.text.inverse',

  ':hover': {
    backgroundColor: 'color.background.discovery.bold.hovered',
  },
  ':active': {
    backgroundColor: 'color.background.discovery.bold.pressed',
  },
});

export default function PressableStyled() {
  return (
    <Pressable
      xcss={pressableStyles}
      backgroundColor="color.background.discovery.bold"
      padding="space.100"
    >
      Pressable
    </Pressable>
  );
}
