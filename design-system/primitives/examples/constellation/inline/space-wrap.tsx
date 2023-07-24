import React, { useState } from 'react';

import Button from '@atlaskit/button';
import { Inline, Stack } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Example() {
  const [rowSpace, setRowSpace] = useState<'space.100' | undefined>(undefined);
  const toggleSpace = () => {
    setRowSpace(rowSpace === 'space.100' ? undefined : 'space.100');
  };

  return (
    <Stack alignInline="start" space="space.500">
      <Button appearance="primary" onClick={toggleSpace}>
        Change space between rows
      </Button>
      <Inline space="space.200" rowSpace={rowSpace} shouldWrap>
        {[...Array(24).keys()].map(i => (
          <Block />
        ))}
      </Inline>
    </Stack>
  );
}
