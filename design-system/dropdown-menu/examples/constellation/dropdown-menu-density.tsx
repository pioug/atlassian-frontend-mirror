/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import DropdownMenu, {
  DropdownItem,
  DropdownItemCheckbox,
  DropdownItemGroup,
} from '../../src';

const containerStyles = css({
  display: 'flex',
  gap: token('space.600', '48px'),
  flexDirection: 'row',
});

export default () => (
  <div css={containerStyles}>
    <DropdownMenu trigger="Compact density" testId="dropdown" spacing="compact">
      <DropdownItemGroup>
        <DropdownItem>Copy issue link</DropdownItem>
        <DropdownItem>Add flag</DropdownItem>
        <DropdownItem>Add label</DropdownItem>
        <DropdownItem>Add parent</DropdownItem>
        <DropdownItem>Print</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItem>Remove from sprint</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItemCheckbox id="action">Action</DropdownItemCheckbox>
        <DropdownItemCheckbox id="filter">Filter</DropdownItemCheckbox>
      </DropdownItemGroup>
    </DropdownMenu>
    <DropdownMenu trigger="Cozy density" testId="dropdown">
      <DropdownItemGroup>
        <DropdownItem>Copy issue link</DropdownItem>
        <DropdownItem>Add flag</DropdownItem>
        <DropdownItem>Add label</DropdownItem>
        <DropdownItem>Add parent</DropdownItem>
        <DropdownItem>Print</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItem>Remove from sprint</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup hasSeparator>
        <DropdownItemCheckbox id="action-2">Action</DropdownItemCheckbox>
        <DropdownItemCheckbox id="filter-2">Filter</DropdownItemCheckbox>
      </DropdownItemGroup>
    </DropdownMenu>
  </div>
);
