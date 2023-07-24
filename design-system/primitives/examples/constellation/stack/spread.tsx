import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Example() {
  const [spread, setSpread] = useState<'space-between' | undefined>(undefined);
  const toggleSpread = useCallback(() => {
    setSpread(spread === 'space-between' ? undefined : 'space-between');
  }, [spread]);

  return (
    <Stack alignInline="start" space="space.500">
      <Button appearance="primary" onClick={toggleSpread}>
        Toggle spread
      </Button>
      <Stack space="space.200">
        <Heading level="h400">The Golden Goddesses:</Heading>
        <Inline space="space.100">
          <Stack space="space.1000">
            <Block />
            <Block />
            <Block />
          </Stack>
          <Stack space="space.100" spread={spread}>
            <Block />
            <Block />
            <Block />
          </Stack>
        </Inline>
      </Stack>
    </Stack>
  );
}
