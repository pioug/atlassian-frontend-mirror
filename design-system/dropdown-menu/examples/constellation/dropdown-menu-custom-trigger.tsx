import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const DropdownMenuCustomTriggerExample = () => {
  return (
    <DropdownMenu<HTMLButtonElement>
      trigger={({ triggerRef, isSelected, testId, ...providedProps }) => (
        // eslint-disable-next-line @repo/internal/react/use-primitives
        <button type="button" {...providedProps} ref={triggerRef}>
          &lt;button/&gt; trigger{' '}
        </button>
      )}
    >
      <DropdownItemGroup>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Share</DropdownItem>
        <DropdownItem>Move</DropdownItem>
        <DropdownItem>Clone</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
        <DropdownItem>Report</DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default DropdownMenuCustomTriggerExample;
