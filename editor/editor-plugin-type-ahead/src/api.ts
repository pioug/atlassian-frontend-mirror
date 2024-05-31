import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import { SelectItemMode, TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { Command } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { insertTypeAheadItem } from './commands/insert-type-ahead-item';
import { updateQuery } from './commands/update-query';
import { closeTypeAhead } from './transforms/close-type-ahead';
import { openTypeAheadAtCursor } from './transforms/open-typeahead-at-cursor';
import type { TypeAheadHandler, TypeAheadInputMethod } from './types';
import { findHandler, getTypeAheadHandler, getTypeAheadQuery, isTypeAheadOpen } from './utils';

type CommonProps = {
	editorView: EditorView;
};
const open =
	({ editorView }: CommonProps) =>
	(itemType: TypeAheadAvailableNodes) =>
	(inputMethod: TypeAheadInputMethod) => {
		const { state } = editorView;

		const handler = findHandler(itemType, state);
		if (!handler) {
			return false;
		}

		const { tr } = state;

		openTypeAheadAtCursor({ triggerHandler: handler, inputMethod })({ tr });

		editorView.dispatch(tr);

		return true;
	};

type CloseOptions = {
	insertCurrentQueryAsRawText: boolean;
	attachCommand?: Command;
};
const defaultCloseOptions: CloseOptions = {
	insertCurrentQueryAsRawText: false,
};
const close =
	({ editorView }: CommonProps) =>
	(options: CloseOptions = defaultCloseOptions) => {
		const { state } = editorView;
		const currentQuery = getTypeAheadQuery(editorView.state);

		let tr = state.tr;
		if (options.attachCommand) {
			const fakeDispatch = (customTr: Transaction) => {
				tr = customTr;
			};

			options.attachCommand(state, fakeDispatch);
		}

		closeTypeAhead(tr);

		if (options.insertCurrentQueryAsRawText && currentQuery && currentQuery.length > 0) {
			const handler = getTypeAheadHandler(state)!;
			const text = handler.trigger.concat(currentQuery);
			tr.replaceSelectionWith(state.schema.text(text));
		}

		editorView.dispatch(tr);

		if (!editorView.hasFocus()) {
			editorView.focus();
		}

		return true;
	};

const search =
	({ editorView }: CommonProps) =>
	(itemType: TypeAheadAvailableNodes) =>
	(query: string = '') => {
		const { state } = editorView;

		const handler = findHandler(itemType, state);
		if (!handler) {
			throw new Error(`Handler not found, did you load the ${itemType} plugin properly`);
		}

		open({ editorView })(itemType)(INPUT_METHOD.KEYBOARD);
		updateQuery(query)(editorView.state, editorView.dispatch);

		const lastQuery = { current: query };
		const last = handler.getItems({ query, editorState: state }).then((items) => {
			if (!handler.forceSelect) {
				return items;
			}

			const forceSelectedItem = handler.forceSelect({
				items,
				query,
				editorState: state,
			});

			if (!forceSelectedItem) {
				return items;
			}

			insertTypeAheadItem(editorView)({
				handler,
				item: forceSelectedItem,
				query,
				mode: SelectItemMode.SELECTED,
				sourceListItem: items,
			});
		});
		const results = { last };

		return {
			type: (appendValue: string) => {
				if (!appendValue) {
					return;
				}

				lastQuery.current += appendValue;
				updateQuery(lastQuery.current)(editorView.state, editorView.dispatch);
				const promise = handler.getItems({
					query: lastQuery.current,
					editorState: state,
				});
				results.last = promise;
				return promise;
			},
			result: () => results.last,
			close: close({ editorView }),
			insert: ({ index, mode }: { index: number; mode?: SelectItemMode }) => {
				return results.last.then((result) => {
					const item = result ? result[index] : null;
					if (result && item) {
						insertTypeAheadItem(editorView)({
							handler,
							item,
							query,
							mode: mode || SelectItemMode.SELECTED,
							sourceListItem: result,
						});
					}
				});
			},
		};
	};

type InsertItemProps = {
	contentItem: TypeAheadItem;
	query: string;
	sourceListItem: TypeAheadItem[];
};
const insertItem =
	({ editorView }: CommonProps) =>
	(itemType: TypeAheadAvailableNodes) =>
	({ contentItem, query, sourceListItem }: InsertItemProps) => {
		const { state } = editorView;

		const handler = findHandler(itemType, state);
		if (!handler) {
			return false;
		}

		insertTypeAheadItem(editorView)({
			handler,
			item: contentItem,
			mode: SelectItemMode.SELECTED,
			query,
			sourceListItem,
		});
		return true;
	};

const isOpen =
	({ editorView }: CommonProps) =>
	(): TypeAheadHandler | false => {
		if (!isTypeAheadOpen(editorView.state)) {
			return false;
		}

		const handler = getTypeAheadHandler(editorView.state);
		if (!handler) {
			return false;
		}

		return handler;
	};

const currentQuery =
	({ editorView }: CommonProps) =>
	(): string | undefined => {
		return getTypeAheadQuery(editorView.state);
	};

/**
 * Please do not use it. Ping #help-editor and talk to the Lego team before use it.
 *
 * @private
 * @deprecated
 *
 */
export const createTypeAheadTools = (editorView: EditorView) => {
	const props: CommonProps = {
		editorView,
	};

	return {
		isOpen: isOpen(props),
		currentQuery: currentQuery(props),
		close: close(props),

		openMention: open(props)(TypeAheadAvailableNodes.MENTION),
		searchMention: search(props)(TypeAheadAvailableNodes.MENTION),

		openQuickInsert: open(props)(TypeAheadAvailableNodes.QUICK_INSERT),
		searchQuickInsert: search(props)(TypeAheadAvailableNodes.QUICK_INSERT),

		openEmoji: open(props)(TypeAheadAvailableNodes.EMOJI),
		searchEmoji: search(props)(TypeAheadAvailableNodes.EMOJI),

		insertItemMention: insertItem(props)(TypeAheadAvailableNodes.MENTION),
		insertItemEmoji: insertItem(props)(TypeAheadAvailableNodes.EMOJI),
		insertItemQuickInsert: insertItem(props)(TypeAheadAvailableNodes.QUICK_INSERT),
	};
};
