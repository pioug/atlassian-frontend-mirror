import React from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { OnInsert } from '../ElementBrowser/types';
import { BlockInsertElementBrowser } from './block-insert-element-browser';
import { BlockInsertMenuLegacy } from './block-insert-menu-legacy';
import type { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';
import type { PluginInjectionAPIWithDependencies } from '@atlaskit/editor-common/types';
import type { InsertBlockPluginDependencies } from '../../types';

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
  showElementBrowserLink: boolean;
  onRef(el: HTMLElement): void;
  onPlusButtonRef(el: HTMLElement): void;
  onClick: React.MouseEventHandler;
  onItemActivated(attrs: any): void;
  onInsert: OnInsert;
  onOpenChange(attrs: any): void;
  togglePlusMenuVisibility(): void;
  onKeyDown?: React.KeyboardEventHandler;
  pluginInjectionApi:
    | PluginInjectionAPIWithDependencies<InsertBlockPluginDependencies>
    | undefined;
}

export const BlockInsertMenu: React.FC<BlockInsertMenuProps> = (props) => {
  if (props.items.length === 0) {
    return null;
  }

  if (props.disabled) {
    return (
      <div>
        <DropDownButton
          aria-expanded={props.open}
          aria-haspopup
          handleRef={props.onRef}
          selected={props.open}
          disabled={props.disabled}
          onClick={props.onClick}
          onKeyDown={props.onKeyDown}
          spacing={props.spacing}
          label={props.label}
          aria-keyshortcuts="/"
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
        onKeyDown={props.onKeyDown}
        onInsert={props.onInsert}
        onRef={props.onPlusButtonRef}
        open={props.open}
        plusButtonRef={props.plusButtonRef}
        popupsBoundariesElement={props.popupsBoundariesElement}
        popupsMountPoint={props.popupsMountPoint}
        popupsScrollableElement={props.popupsScrollableElement}
        spacing={props.spacing}
        togglePlusMenuVisibility={props.togglePlusMenuVisibility}
        showElementBrowserLink={props.showElementBrowserLink}
        pluginInjectionApi={props.pluginInjectionApi}
      />
    );
  }

  return (
    <BlockInsertMenuLegacy
      disabled={props.disabled}
      items={props.items}
      label={props.label}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
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
