import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { PluginInjectionAPIWithDependencies } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { InsertBlockPluginDependencies } from '../../types';
import type { BlockMenuItem } from '../ToolbarInsertBlock/create-items';

type SimpleEventHandler<T> = (event?: T) => void;

export interface InsertMenuProps {
  dropdownItems: BlockMenuItem[];
  editorView: EditorView;
  showElementBrowserLink: boolean;
  toggleVisiblity: SimpleEventHandler<MouseEvent | KeyboardEvent>;
  onInsert: OnInsert;
  pluginInjectionApi:
    | PluginInjectionAPIWithDependencies<InsertBlockPluginDependencies>
    | undefined;
}

export type SvgGetterParams = {
  name: string;
};

export type OnInsert = ({ item }: { item: MenuItem }) => Transaction;
