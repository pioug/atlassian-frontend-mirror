import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { insertSelectedItem } from '@atlaskit/editor-common/insert';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type { Command, EditorCommand } from '@atlaskit/editor-common/types';
import type { Fragment, Node } from '@atlaskit/editor-prosemirror/model';

import { pluginKey } from '../plugin-key';

export const openElementBrowserModal: EditorCommand = ({ tr }) =>
	tr.setMeta(pluginKey, { isElementBrowserModalOpen: true });

export const closeElementBrowserModal = (): Command => (state, dispatch) => {
	if (dispatch) {
		dispatch(state.tr.setMeta(pluginKey, { isElementBrowserModalOpen: false }));
	}
	return true;
};

export const createInsertItem = (onInsert?: (item: QuickInsertItem) => void) =>
	insertItem(onInsert);

// this method was adapted from the typeahead plugin so we respect the API for quick insert items
const insertItem =
	(onInsert?: (item: QuickInsertItem) => void) =>
	(item: QuickInsertItem, source?: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR | INPUT_METHOD.ELEMENT_BROWSER): Command =>
	(state, dispatch) => {
		const insert = (
			maybeNode?: Node | Object | string | Fragment,
			opts: { selectInlineNode?: boolean } = {},
		) => {
			return insertSelectedItem(maybeNode, opts)(state, state.tr, state.selection.head);
		};

		const tr = item.action(insert, state, source);

		/** @note There is no transaction when called without a search currently (different insert) */
		if (tr && dispatch) {
			dispatch(tr);
		}

		onInsert?.(item);

		return true;
	};
