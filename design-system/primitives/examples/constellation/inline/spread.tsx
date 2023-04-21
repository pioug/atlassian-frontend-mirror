import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import { Inline, Stack } from '@atlaskit/primitives';

import Square from '../shared/square';

export default function Example() {
  const [spread, setSpread] = useState<'space-between' | undefined>(undefined);
  const changeSpread = useCallback(() => {
    setSpread(spread === 'space-between' ? undefined : 'space-between');
  }, [spread]);

  return (
    <Stack space="space.500">
      <div>
        <Button appearance="primary" onClick={changeSpread}>
          Toggle spread
        </Button>
      </div>
      <Inline space="space.100" grow="fill" spread={spread}>
        <Square />
        <Square />
        <Square />
      </Inline>
    </Stack>
  );
}
