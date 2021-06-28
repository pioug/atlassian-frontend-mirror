import React from 'react';

import CheckIcon from '@atlaskit/icon/glyph/check';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemElemAfterExample = () => {
  return (
    <DropdownMenu triggerType="button">
      <DropdownItemGroup>
        <DropdownItem elemAfter={<CheckIcon label="" />}>Kelly</DropdownItem>
        <DropdownItem elemAfter={<CheckIcon label="" />}>Matt</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemElemAfterExample;
