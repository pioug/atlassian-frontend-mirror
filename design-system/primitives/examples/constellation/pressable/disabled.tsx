import React, { useCallback, useState } from 'react';

import { Inline, Stack, xcss } from '@atlaskit/primitives';
import Pressable from '@atlaskit/primitives/pressable';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const pressableStyles = xcss({
  fontWeight: token('font.weight.medium'),
});

const activeStyles = xcss({
  color: 'color.text.subtle',

  ':hover': {
    textDecoration: 'underline',
  },
  ':active': {
    color: 'color.text',
  },
});

const disabledStyles = xcss({
  color: 'color.text.disabled',
});

export default function Disabled() {
  const handleClick = useCallback(() => {
    alert('Clicked');
  }, []);

  const [isDisabled, setIsDisabled] = useState(true);
  const toggleDisabled = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsDisabled(event.currentTarget.checked);
    },
    [],
  );
  return (
    <Stack space="space.200" alignInline="start">
      <Inline alignBlock="center">
        <Toggle
          isChecked={isDisabled}
          id="is-disabled"
          onChange={toggleDisabled}
        />
        <label htmlFor="is-disabled">Disabled</label>
      </Inline>
      <Pressable
        onClick={handleClick}
        padding="space.0"
        backgroundColor="color.background.neutral.subtle"
        xcss={[pressableStyles, isDisabled ? disabledStyles : activeStyles]}
        isDisabled={isDisabled}
      >
        Edit comment
      </Pressable>
    </Stack>
  );
}
