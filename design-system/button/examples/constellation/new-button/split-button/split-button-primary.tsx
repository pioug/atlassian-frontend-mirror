import React from 'react';

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import Button, { IconButton, SplitButton } from '../../../../src/new';

const SplitButtonPrimaryExample = () => {
  return (
    <SplitButton appearance="primary">
      <Button>Update</Button>
      <DropdownMenu<HTMLButtonElement>
        trigger={({ triggerRef, ...triggerProps }) => (
          <IconButton
            ref={triggerRef}
            {...triggerProps}
            icon={ChevronDownIcon}
            label="More update options"
          />
        )}
      >
        <DropdownItemGroup>
          <DropdownItem>Option one</DropdownItem>
          <DropdownItem>Option two</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </SplitButton>
  );
};

export default SplitButtonPrimaryExample;
