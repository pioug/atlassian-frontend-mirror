import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu/DropdownMenu/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { InsertBlockPlugin } from '../../index';
import type { BlockMenuItem } from '../ToolbarInsertBlock/create-items';

type SimpleEventHandler<T> = (event?: T) => void;

export interface InsertMenuProps {
	dropdownItems: BlockMenuItem[];
	editorView: EditorView;
	isFullPageAppearance?: boolean;
	onInsert: OnInsert;
	pluginInjectionApi: ExtractInjectionAPI<InsertBlockPlugin> | undefined;
	showElementBrowserLink: boolean;
	toggleVisiblity: SimpleEventHandler<MouseEvent | KeyboardEvent>;
}

export type SvgGetterParams = {
	name: string;
};

export type OnInsert = ({ item }: { item: MenuItem }) => Transaction;
