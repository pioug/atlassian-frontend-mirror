import React from 'react';

import Button from '@atlaskit/button';
import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import { Hide } from '@atlaskit/primitives/responsive';

export default function Example() {
  return (
    <Button
      iconBefore={
        <Hide below="md">
          <AddItemIcon label="" size="medium" />
        </Hide>
      }
    >
      Add a new issue
    </Button>
  );
}
