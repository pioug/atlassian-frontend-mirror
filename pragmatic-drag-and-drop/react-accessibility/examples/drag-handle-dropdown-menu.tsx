import React, { useRef } from 'react';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import { DragHandleDropdownMenu } from '../src/drag-handle-dropdown-menu';

export default function DragHandleDropdownMenuExample() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DragHandleDropdownMenu triggerRef={triggerRef} label="Reorder">
      <DropdownItemGroup>
        <DropdownItem>Move up</DropdownItem>
        <DropdownItem>Move down</DropdownItem>
      </DropdownItemGroup>
    </DragHandleDropdownMenu>
  );
}
