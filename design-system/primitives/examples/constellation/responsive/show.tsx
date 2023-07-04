import React from 'react';

import Button from '@atlaskit/button';
import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import { Show } from '@atlaskit/primitives/responsive';

export default function Example() {
  return (
    <Button
      iconBefore={
        <Show above="md">
          <AddItemIcon label="" size="medium" />
        </Show>
      }
    >
      Add a new issue
    </Button>
  );
}
