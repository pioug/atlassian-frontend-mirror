import React from 'react';

import Button from '@atlaskit/button/standard-button';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <DropdownMenu
    trigger={(providedProps) => (
      <Button isDisabled {...providedProps}>
        Disabled button
      </Button>
    )}
  >
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
