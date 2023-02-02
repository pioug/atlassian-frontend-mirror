import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Popup } from '@atlaskit/editor-common/ui';
import InsertMenu from '../../../../ui/ElementBrowser/InsertMenu';
import { BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';
import { OnInsert } from '../../../../ui/ElementBrowser/types';

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
  onInsert: OnInsert;
  togglePlusMenuVisibility: SimpleEventHandler<MouseEvent | KeyboardEvent>;
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
        >
          <InsertMenu
            editorView={props.editorView}
            dropdownItems={props.items}
            onInsert={props.onInsert}
            toggleVisiblity={props.togglePlusMenuVisibility}
            showElementBrowserLink={props.showElementBrowserLink}
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
        spacing={props.spacing}
        label={props.label}
        aria-keyshortcuts="/"
      />
    </>
  );
};
