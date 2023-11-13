import React from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Popup } from '@atlaskit/editor-common/ui';
import InsertMenu from '../ElementBrowser/InsertMenu';
import type { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';
import type { OnInsert } from '../ElementBrowser/types';
import type { PluginInjectionAPIWithDependencies } from '@atlaskit/editor-common/types';
import type { InsertBlockPluginDependencies } from '../../types';

type SimpleEventHandler<T> = (event?: T) => void;

export interface BlockInsertElementBrowserProps {
  disabled: boolean;
  editorView: EditorView;
  items: BlockMenuItem[];
  spacing: 'none' | 'default';
  label: string;
  open: boolean;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  plusButtonRef?: HTMLElement;
  showElementBrowserLink: boolean;
  onRef(el: HTMLElement): void;
  onClick: React.MouseEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onInsert: OnInsert;
  togglePlusMenuVisibility: SimpleEventHandler<MouseEvent | KeyboardEvent>;
  pluginInjectionApi:
    | PluginInjectionAPIWithDependencies<InsertBlockPluginDependencies>
    | undefined;
}

export const BlockInsertElementBrowser: React.FC<
  BlockInsertElementBrowserProps
> = (props) => {
  return (
    <>
      {props.open && (
        <Popup
          target={props.plusButtonRef}
          fitHeight={500}
          fitWidth={350}
          offset={[0, 3]}
          mountTo={props.popupsMountPoint}
          boundariesElement={props.popupsBoundariesElement}
          scrollableElement={props.popupsScrollableElement}
          preventOverflow={true}
          alignX="right"
        >
          <InsertMenu
            editorView={props.editorView}
            dropdownItems={props.items}
            onInsert={props.onInsert}
            toggleVisiblity={props.togglePlusMenuVisibility}
            showElementBrowserLink={props.showElementBrowserLink}
            pluginInjectionApi={props.pluginInjectionApi}
          />
        </Popup>
      )}
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
    </>
  );
};
