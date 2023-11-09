import React, { useCallback, useState } from 'react';

import { Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import { UNSAFE_BUTTON } from '../../../../src';

const ButtonOverlayExample = () => {
  const [isOverlayActive, setIsOverlayActive] = useState(true);

  const toggleOverlay = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsOverlayActive(event.currentTarget.checked);
    },
    [],
  );

  return (
    <Stack space="space.200" alignInline="start">
      <Inline alignBlock="center">
        <Toggle
          isChecked={isOverlayActive}
          id="show-overlay"
          onChange={toggleOverlay}
        />
        <label htmlFor="show-overlay">Show overlay</label>
      </Inline>
      <UNSAFE_BUTTON overlay={isOverlayActive ? 'Overlay' : undefined}>
        Button
      </UNSAFE_BUTTON>
    </Stack>
  );
};

export default ButtonOverlayExample;
