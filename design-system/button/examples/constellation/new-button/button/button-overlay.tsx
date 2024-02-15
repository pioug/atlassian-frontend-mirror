import React, { useCallback, useState } from 'react';

import { Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import Button from '../../../../src/new';
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
      <Button overlay={isOverlayActive ? 'Overlay' : undefined}>Button</Button>
    </Stack>
  );
};

export default ButtonOverlayExample;
