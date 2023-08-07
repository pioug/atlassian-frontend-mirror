import React from 'react';

import { Stack } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Example() {
  return (
    <Stack>
      <ExampleBox />
      <ExampleBox />
      <ExampleBox />
    </Stack>
  );
}
