import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import { Inline, Stack } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Example() {
  const [spread, setSpread] = useState<'space-between' | undefined>(undefined);
  const toggleSpread = useCallback(() => {
    setSpread(spread === 'space-between' ? undefined : 'space-between');
  }, [spread]);

  return (
    <Stack alignInline="start" space="space.100">
      <Button appearance="primary" onClick={toggleSpread}>
        Toggle spread
      </Button>
      <Inline alignBlock="stretch">
        <Stack space="space.1000">
          <ExampleBox />
          <ExampleBox />
          <ExampleBox />
        </Stack>
        <Stack spread={spread}>
          <ExampleBox />
          <ExampleBox />
          <ExampleBox />
        </Stack>
      </Inline>
    </Stack>
  );
}
