import React from 'react';

import EditIcon from '@atlaskit/icon/glyph/edit';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownItemGroupElemAfterExample = () => {
  return (
    <DropdownMenu trigger="Page actions" triggerType="button">
      <DropdownItemGroup title="Edit page" elemAfter={<EditIcon label="" />}>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup title="Tools" elemAfter={<EditIcon label="" />}>
        <DropdownItem>Integrations</DropdownItem>
        <DropdownItem>Permissions</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownItemGroupElemAfterExample;
