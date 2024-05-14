import React, { useCallback, useState } from 'react';

import { Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import Button from '../../../../src/new';

const ButtonLoadingExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(event.currentTarget.checked);
    },
    [],
  );

  return (
    <Stack space="space.200" alignInline="start">
      <Inline alignBlock="center">
        <Toggle
          isChecked={isLoading}
          id="enable-loading"
          onChange={toggleLoading}
        />
        <label htmlFor="show-overlay">Enable loading state</label>
      </Inline>
      <Button isLoading={isLoading}>Button</Button>
    </Stack>
  );
};

export default ButtonLoadingExample;
