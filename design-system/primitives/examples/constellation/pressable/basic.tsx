import React, { useCallback } from 'react';

import { xcss } from '@atlaskit/primitives';
import Pressable from '@atlaskit/primitives/pressable';
import { token } from '@atlaskit/tokens';

const pressableStyles = xcss({
  color: 'color.text.subtle',
  fontWeight: token('font.weight.medium'),

  ':hover': {
    textDecoration: 'underline',
  },
  ':active': {
    color: 'color.text',
  },
});

export default function Basic() {
  const handleClick = useCallback(() => {
    alert('Clicked');
  }, []);

  return (
    <Pressable
      onClick={handleClick}
      padding="space.0"
      backgroundColor="color.background.neutral.subtle"
      xcss={pressableStyles}
    >
      Edit comment
    </Pressable>
  );
}
