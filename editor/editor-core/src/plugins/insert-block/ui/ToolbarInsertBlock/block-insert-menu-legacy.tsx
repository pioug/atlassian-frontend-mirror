import React from 'react';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';

export interface BlockInsertMenuLegacyProps {
  disabled: boolean;
  spacing: 'none' | 'default';
  label: string;
  open: boolean;
  items: BlockMenuItem[];
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  onClick: React.MouseEventHandler;
  onRef(el: HTMLElement): void;
  onItemActivated(attrs: any): void;
  onOpenChange(attrs: any): void;
}

export const BlockInsertMenuLegacy: React.FC<BlockInsertMenuLegacyProps> = (
  props,
) => {
  const { items } = props;
  const dropdownItems = React.useMemo(() => [{ items }], [items]);

  return (
    <DropdownMenu
      items={dropdownItems}
      onItemActivated={props.onItemActivated}
      onOpenChange={props.onOpenChange}
      mountTo={props.popupsMountPoint}
      boundariesElement={props.popupsBoundariesElement}
      scrollableElement={props.popupsScrollableElement}
      isOpen={props.open}
      fitHeight={188}
      fitWidth={175}
      zIndex={akEditorMenuZIndex}
    >
      <DropDownButton
        handleRef={props.onRef}
        selected={props.open}
        disabled={props.disabled}
        onClick={props.onClick}
        spacing={props.spacing}
        label={props.label}
      />
    </DropdownMenu>
  );
};
