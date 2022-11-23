import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { UNSAFE_Inline as Inline } from '@atlaskit/ds-explorations';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Inline gap="scale.200">
      <Button
        testId="toggle"
        onClick={() => setLoading((loadingState) => !loadingState)}
      >
        Toggle isLoading
      </Button>
      <DropdownMenu
        trigger="Page actions"
        isOpen
        testId="dropdown"
        isLoading={isLoading}
        placement="bottom-end"
      >
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </Inline>
  );
};
