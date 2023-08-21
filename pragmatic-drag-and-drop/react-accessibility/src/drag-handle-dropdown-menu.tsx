import React, { ReactElement, Ref, useCallback } from 'react';

import DropdownMenu, { CustomTriggerProps } from '@atlaskit/dropdown-menu';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import {
  DragHandleButton,
  DragHandleButtonAppearance,
} from './drag-handle-button';

export type DragHandleDropdownMenuProps = {
  /**
   * The contents of the dropdown menu.
   */
  children: ReactElement;
  /**
   * Ref for the button which acts as the dropdown trigger.
   */
  triggerRef: Ref<HTMLButtonElement>;
  /**
   * The appearance of the button which acts as the dropdown trigger.
   */
  appearance?: DragHandleButtonAppearance;
  /**
   * The string used as the button label.
   */
  label: string;
};

/**
 * A dropdown menu with a predefined trigger, styled to look like a drag handle.
 *
 * The API is designed to mirror the `@atlaskit/dropdown-menu` API.
 */
export function DragHandleDropdownMenu({
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
        <DragHandleButton
          ref={mergedRef}
          {...triggerProps}
          label={label}
          appearance={appearance}
        />
      );
    },
    [appearance, consumerRef, label],
  );

  return <DropdownMenu trigger={renderTrigger}>{children}</DropdownMenu>;
}
