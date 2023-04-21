import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives';

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
        <Stack
          space="space.100"
          grow="fill"
          alignInline={alignmentValues[alignmentIndex]}
        >
          <Lozenge isBold>Uno</Lozenge>
          <Lozenge isBold>Dos</Lozenge>
          <Lozenge isBold>Tres</Lozenge>
        </Stack>
      </Stack>
    </Stack>
  );
}
