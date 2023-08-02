import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { BlockMenuItem } from '../../plugins/insert-block/ui/ToolbarInsertBlock/create-items';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';

type SimpleEventHandler<T> = (event?: T) => void;

export type Category = {
  title: string;
  name: string;
};

export enum Modes {
  full = 'full',
  inline = 'inline',
}

export type SelectedItemProps = {
  selectedItemIndex?: number;
  focusedItemIndex?: number;
};

export interface InsertMenuProps {
  dropdownItems: BlockMenuItem[];
  editorView: EditorView;
  showElementBrowserLink: boolean;
  toggleVisiblity: SimpleEventHandler<MouseEvent | KeyboardEvent>;
  onInsert: OnInsert;
}

export type OnInsert = ({ item }: { item: MenuItem }) => Transaction;

export type SvgGetterParams = {
  name: string;
};
