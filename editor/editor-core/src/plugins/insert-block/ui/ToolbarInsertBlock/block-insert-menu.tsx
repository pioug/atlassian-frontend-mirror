import React from 'react';
import { EditorView } from 'prosemirror-view';
import { OnInsert } from '../../../../ui/ElementBrowser/types';
import { BlockInsertElementBrowser } from './block-insert-element-browser';
import { BlockInsertMenuLegacy } from './block-insert-menu-legacy';
import { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';

export interface BlockInsertMenuProps {
  disabled: boolean;
  editorView: EditorView;
  items: BlockMenuItem[];
  label: string;
  open: boolean;
  plusButtonRef?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  replacePlusMenuWithElementBrowser: boolean;
  spacing: 'none' | 'default';
  onRef(el: HTMLElement): void;
  onPlusButtonRef(el: HTMLElement): void;
  onClick: React.MouseEventHandler;
  onItemActivated(attrs: any): void;
  onInsert: OnInsert;
  onOpenChange(attrs: any): void;
  togglePlusMenuVisibility(): void;
}

export const BlockInsertMenu: React.FC<BlockInsertMenuProps> = (props) => {
  if (props.items.length === 0) {
    return null;
  }

  if (props.disabled) {
    return (
      <div>
        <DropDownButton
          handleRef={props.onRef}
          selected={props.open}
          disabled={props.disabled}
          onClick={props.onClick}
          spacing={props.spacing}
          label={props.label}
        />
      </div>
    );
  }

  if (props.replacePlusMenuWithElementBrowser) {
    return (
      <BlockInsertElementBrowser
        disabled={props.disabled}
        editorView={props.editorView}
        items={props.items}
        label={props.label}
        onClick={props.onClick}
        onInsert={props.onInsert}
        onRef={props.onPlusButtonRef}
        open={props.open}
        plusButtonRef={props.plusButtonRef}
        popupsBoundariesElement={props.popupsBoundariesElement}
        popupsMountPoint={props.popupsMountPoint}
        popupsScrollableElement={props.popupsScrollableElement}
        spacing={props.spacing}
        togglePlusMenuVisibility={props.togglePlusMenuVisibility}
      />
    );
  }

  return (
    <BlockInsertMenuLegacy
      disabled={props.disabled}
      items={props.items}
      label={props.label}
      onClick={props.onClick}
      onItemActivated={props.onItemActivated}
      onOpenChange={props.onOpenChange}
      onRef={props.onRef}
      open={props.open}
      popupsBoundariesElement={props.popupsBoundariesElement}
      popupsMountPoint={props.popupsMountPoint}
      popupsScrollableElement={props.popupsScrollableElement}
      spacing={props.spacing}
    />
  );
};
