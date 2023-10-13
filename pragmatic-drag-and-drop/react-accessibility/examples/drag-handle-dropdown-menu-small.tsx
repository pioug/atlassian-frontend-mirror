import React, { useRef } from 'react';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import { DragHandleDropdownMenuSmall } from '../src/drag-handle-dropdown-menu-small';

export default function DragHandleDropdownMenuSmallExample() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DragHandleDropdownMenuSmall triggerRef={triggerRef} label="Reorder">
      <DropdownItemGroup>
        <DropdownItem>Move up</DropdownItem>
        <DropdownItem>Move down</DropdownItem>
      </DropdownItemGroup>
    </DragHandleDropdownMenuSmall>
  );
}
