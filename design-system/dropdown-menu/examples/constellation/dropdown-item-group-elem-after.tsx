import React from 'react';

import CheckIcon from '@atlaskit/icon/glyph/check';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemGroupElemAfterExample = () => (
  <DropdownMenu trigger="Filter cities" triggerType="button">
    <DropdownItemGroup
      title="Australian cities"
      elemAfter={<CheckIcon label="" />}
    >
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup
      title="Canadian cities"
      elemAfter={<CheckIcon label="" />}
    >
      <DropdownItem>Toronto</DropdownItem>
      <DropdownItem>Vancouver</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default DropdownItemGroupElemAfterExample;
