import React, { useCallback } from 'react';

import DropdownMenu, { CustomTriggerProps } from '@atlaskit/dropdown-menu';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import { DragHandleButtonBase } from './drag-handle-button-base';
import { DragHandleIconSmall } from './drag-handle-icon-small';
import type { DragHandleDropdownMenuProps } from './types';

/**
 * A dropdown menu with a predefined trigger, styled to look like a drag handle.
 *
 * The API is designed to mirror the `@atlaskit/dropdown-menu` API.
 */
export function DragHandleDropdownMenuSmall({
  children,
  triggerRef: consumerRef,
  appearance,
  label,
}: DragHandleDropdownMenuProps) {
  const renderTrigger = useCallback(
    ({
      triggerRef,
      ...triggerProps
    }: CustomTriggerProps<HTMLButtonElement>) => {
      const mergedRef = mergeRefs([consumerRef, triggerRef]);
      return (
        <DragHandleButtonBase
          ref={mergedRef}
          appearance={appearance}
          {...triggerProps}
        >
          <DragHandleIconSmall label={label} />
        </DragHandleButtonBase>
      );
    },
    [appearance, consumerRef, label],
  );

  return <DropdownMenu trigger={renderTrigger}>{children}</DropdownMenu>;
}
