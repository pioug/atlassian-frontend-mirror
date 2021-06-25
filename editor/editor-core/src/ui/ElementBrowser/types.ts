import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';

import { BlockMenuItem } from '../../plugins/insert-block/ui/ToolbarInsertBlock/create-items';
import { MenuItem } from '../DropdownMenu/types';

export type Category = {
  title: string;
  name: string;
};

export enum Modes {
  full = 'full',
  inline = 'inline',
}

export type SelectedItemProps = {
  selectedItemIndex: number;
  focusedItemIndex?: number;
};

export type IntlMessage = {
  id: string;
  description: string;
  defaultMessage: string;
};

export interface InsertMenuProps {
  dropdownItems: BlockMenuItem[];
  editorView: EditorView;
  toggleVisiblity: () => void;
  onInsert: OnInsert;
}

export type OnInsert = ({ item }: { item: MenuItem }) => Transaction;

export type SvgGetterParams = {
  name: string;
};
