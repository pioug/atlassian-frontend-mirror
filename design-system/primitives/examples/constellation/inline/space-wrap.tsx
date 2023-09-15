import React, { useState } from 'react';

import { Label } from '@atlaskit/form';
import { Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import ExampleBox from '../shared/example-box';

export default function Example() {
  const [rowSpace, setRowSpace] = useState<'space.300' | undefined>(undefined);
  const toggleSpace = () => {
    setRowSpace(rowSpace === 'space.300' ? undefined : 'space.300');
  };

  return (
    <Stack alignInline="start" space="space.500">
      <Inline alignBlock="center">
        <Label htmlFor="toggle-space">Toggle space between rows</Label>
        <Toggle id="toggle-space" onChange={toggleSpace} />
      </Inline>
      <Inline space="space.200" rowSpace={rowSpace} shouldWrap>
        {[...Array(24).keys()].map(i => (
          <ExampleBox />
        ))}
      </Inline>
    </Stack>
  );
}
