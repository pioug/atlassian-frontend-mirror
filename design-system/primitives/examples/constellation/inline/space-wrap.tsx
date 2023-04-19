import React, { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';

import { Inline, Stack } from '../../../src';

export default function Example() {
  const [rowSpace, setRowSpace] = useState<'space.100' | undefined>(undefined);
  const changeSpace = useCallback(() => {
    setRowSpace(rowSpace === 'space.100' ? undefined : 'space.100');
  }, [rowSpace]);

  return (
    <Stack space="space.500">
      <div>
        <Button appearance="primary" onClick={changeSpace}>
          Change space between rows
        </Button>
      </div>
      <Inline space="space.200" rowSpace={rowSpace} shouldWrap>
        {[...Array(12).keys()].map(i => (
          <Fragment key={i}>
            <Lozenge appearance="moved">Paused</Lozenge>
            <Lozenge appearance="success">Completed</Lozenge>
          </Fragment>
        ))}
      </Inline>
    </Stack>
  );
}
