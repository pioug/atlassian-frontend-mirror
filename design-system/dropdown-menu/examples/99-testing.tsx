import React from 'react';

import { Label } from '@atlaskit/form';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

const emptyContainerStyles = xcss({
  height: '100vh',
});

export default () => (
  <div>
    <DropdownMenu trigger="Page actions" testId="dropdown">
      <DropdownItemGroup>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
    <Box xcss={emptyContainerStyles}></Box>
    <Label htmlFor="basic-textfield">Field label</Label>
    <Textfield name="basic" id="basic-textfield" />
  </div>
);
