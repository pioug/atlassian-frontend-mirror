import React, { useCallback, useState } from 'react';

import { Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import ExampleBox from '../shared/example-box';

export default function Example() {
  const [spread, setSpread] = useState<'space-between' | undefined>(undefined);
  const toggleSpread = useCallback(() => {
    setSpread(spread === 'space-between' ? undefined : 'space-between');
  }, [spread]);

  return (
    <Stack alignInline="start" space="space.500">
      <Inline alignBlock="center">
        Toggle spread
        <Toggle onChange={toggleSpread} />
      </Inline>
      <Inline space="space.100" grow="fill" spread={spread}>
        <ExampleBox />
        <ExampleBox />
        <ExampleBox />
      </Inline>
    </Stack>
  );
}
