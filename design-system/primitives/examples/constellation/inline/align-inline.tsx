import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives';

import Square from '../shared/square';

const alignmentValues = ['start', 'center', 'end'] as const;

export default function Example() {
  const [alignmentIndex, setAlignmentIndex] = useState<0 | 1 | 2>(0);
  const nextIndex = ((alignmentIndex + 1) % alignmentValues.length) as
    | 0
    | 1
    | 2;
  const changeAlignment = useCallback(() => {
    setAlignmentIndex(nextIndex);
  }, [nextIndex]);
  return (
    <Stack space="space.500">
      <div>
        <Button appearance="primary" onClick={changeAlignment}>
          Change alignment to "{alignmentValues[nextIndex]}"
        </Button>
      </div>
      <Stack space="space.100">
        <Heading level="h400">Inline alignment</Heading>
        <Inline space="space.100" alignInline={alignmentValues[alignmentIndex]}>
          <Square />
          <Square />
          <Square />
        </Inline>
      </Stack>
    </Stack>
  );
}
