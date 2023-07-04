import React from 'react';

import { Hide, Show } from '@atlaskit/primitives/responsive';

export default function Example() {
  return (
    <p>
      Please connect using your{' '}
      <Show below="md" as="span">
        mobile device
      </Show>
      <Hide below="md" as="span">
        desktop or laptop
      </Hide>
    </p>
  );
}
