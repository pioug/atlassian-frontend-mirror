import React from 'react';

import { Stack } from '@atlaskit/primitives';

import variants from '../src/utils/variants';

export default function ButtonsWithIconBeforeOrAfterExample() {
  return (
    <Stack space="space.100">
      {variants.map(({ name, Component }) => (
        <Component key={name} shouldFitContainer>
          {name}
        </Component>
      ))}
    </Stack>
  );
}
