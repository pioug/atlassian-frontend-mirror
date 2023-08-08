import React from 'react';

import Button from '@atlaskit/button';
import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import { Stack } from '@atlaskit/primitives';
import { Hide } from '@atlaskit/primitives/responsive';

export default function Example() {
  return (
    <Stack alignInline="start" space="space.100">
      Try resizing your browser window
      <Button iconBefore={<AddItemIcon label="" size="medium" />}>
        <Hide below="md">This text is visible only at larger breakpoints</Hide>
      </Button>
    </Stack>
  );
}
