import { InsertTypeAheadStages, InsertTypeAheadStep } from '@atlaskit/adf-schema/steps';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type {
	TypeAheadHandler,
	TypeAheadInsert,
	TypeAheadItem,
} from '@atlaskit/editor-common/types';
import { closeHistory } from '@atlaskit/editor-prosemirror/history';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { ACTIONS } from '../actions';
import { pluginKey } from '../key';
import { StatsModifier } from '../stats-modifier';
import { getPluginState } from '../utils';

import { closeTypeAhead } from './close-type-ahead';
import { insertBlockNode, insertInlineNodeOrFragment } from './insert-utils';

const validateNode = ({
	schema,
	maybeNode,
}: {
	schema: Schema;
	maybeNode: PMNode | Object | string | Fragment | undefined;
}): PMNode | Fragment | null => {
	if (!maybeNode) {
		return null;
	}
	if (maybeNode instanceof PMNode || maybeNode instanceof Fragment) {
		return maybeNode;
	}
	if (typeof maybeNode === 'string') {
		return schema.text(maybeNode);
	}
	try {
		return PMNode.fromJSON(schema, maybeNode);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
		return null;
	}
};

type CreateInsertCallbackProps = {
	editorState: EditorState;
	query: string;
	handler: TypeAheadHandler;
	mode: SelectItemMode;
	wasInsertedBySpace: boolean;
	textStartPosition: number;
	textInserted: string;
	selectedIndex: number;
};

const createInsertCallback =
	({
		editorState: state,
		handler,
		query,
		wasInsertedBySpace,
		selectedIndex,
		textStartPosition,
		textInserted,
	}: CreateInsertCallbackProps): TypeAheadInsert =>
	(maybeNode, opts = {}): Transaction => {
		const { tr } = state;
		const position = {
			start: textStartPosition,
			end: textStartPosition + (wasInsertedBySpace ? textInserted.length : 0),
		};

		const node = validateNode({ schema: state.schema, maybeNode });
		if (!node) {
			closeTypeAhead(tr);
			// In this kind of situation we need to
			// delete the raw text query
			tr.delete(position.start, position.end);
			return tr;
		}

		node instanceof PMNode && node.isBlock
			? insertBlockNode({
					node,
					tr,
					position,
				})
			: insertInlineNodeOrFragment({
					maybeFragment: node,
					tr,
					position,
					selectInlineNode: Boolean(opts.selectInlineNode),
				});

		closeHistory(tr);
		if (wasInsertedBySpace) {
			return tr;
		}

		const config = {
			stage: InsertTypeAheadStages.INSERTING_ITEM,
			query,
			selectedIndex,
			trigger: handler.trigger,
		};
		tr.step(new InsertTypeAheadStep(config));
		return tr;
	};

type Position = {
	start: number;
	end: number;
};
type CreateDeleteRawTextCallbackProps = {
	wasInsertedBySpace: boolean;
	insertItem: (state: EditorState) => Transaction | false;
	selectedIndex: number;
	query: string;
	position: Position;
	trigger: string;
};
const createDeleteRawTextCallback = ({
	trigger,
	selectedIndex,
	position,
	query,
	wasInsertedBySpace,
	insertItem,
}: CreateDeleteRawTextCallbackProps) => {
	return (newState: EditorState): Transaction => {
		const tr = newState.tr;

		closeHistory(tr);

		if (!wasInsertedBySpace) {
			tr.delete(position.start, position.end);
			const config = {
				stage: InsertTypeAheadStages.DELETING_RAW_QUERY,
				selectedIndex,
				query,
				trigger,
			};
			tr.step(new InsertTypeAheadStep(config));
		}

		tr.setMeta(pluginKey, {
			action: ACTIONS.INSERT_ITEM,
			params: insertItem,
		});
		return tr;
	};
};

type Props = {
	item: TypeAheadItem;
	handler: TypeAheadHandler;
	mode: SelectItemMode;
	sourceListItem: Array<TypeAheadItem>;
	query: string;
};
export const insertTypeAheadItem =
	(view: EditorView) =>
	({ item, handler, mode, query, sourceListItem }: Props) => {
		const pluginState = getPluginState(view.state);
		if (!pluginState) {
			return;
		}

		const stats = (pluginState.stats || new StatsModifier()).serialize();
		const meta = {
			mode,
			query,
			stats,
			sourceListItem,
		};

		const { tr } = view.state;

		const trigger = handler.trigger;
		let text = `${trigger}${query}`;
		if (mode === SelectItemMode.SPACE) {
			text = text.trim().concat(' ');
		}

		// We want to always persist selectedIndex as -1 upon selecting an item from typeahead
		// in order to retain exist focus behaviour when undoing
		const selectedIndex = -1;
		const wasInsertedBySpace = mode === SelectItemMode.SPACE;
		const {
			selection: { from: textStartPosition },
		} = tr;

		const insertItem = (newEditorSate: EditorState): Transaction | false => {
			const insertCallback = createInsertCallback({
				editorState: newEditorSate,
				query,
				mode,
				handler,
				wasInsertedBySpace,
				selectedIndex,
				textInserted: text,
				textStartPosition,
			});

			let wasInsertCallbackCalled = false;
			// Some wierd plugins doesn't call the insert item callback
			// For example, the link quick insert item
			// For those cases we need to make sure we are closing the typeahead
			const proxyHandler: ProxyHandler<typeof insertCallback> = {
				apply: function (target, _thisContext, argumentsList) {
					wasInsertCallbackCalled = true;
					return target(...argumentsList);
				},
			};
			const insertCallbackProxy = new Proxy(insertCallback, proxyHandler);
			const nextTr = handler.selectItem(newEditorSate, item, insertCallbackProxy, meta);

			if (!wasInsertCallbackCalled && nextTr) {
				closeHistory(nextTr);

				// In some cases we need to re-open the typeahead
				// e.g.: addign mentions from the quick insert
				//
				// Today, the QuickInsert API doesn't have a tool
				// to help on this. So the code below will close the typeahead
				// only if there is no previous metadata about typeahead in the
				// next transaction
				if (!nextTr.getMeta(pluginKey)) {
					closeTypeAhead(nextTr);
				}
			}

			return nextTr;
		};

		const position = {
			start: tr.selection.from,
			end: tr.selection.from + text.length,
		};

		tr.setMeta(pluginKey, {
			action: ACTIONS.INSERT_RAW_QUERY,
			params: createDeleteRawTextCallback({
				wasInsertedBySpace,
				selectedIndex,
				insertItem,
				position,
				query,
				trigger,
			}),
		});
		tr.insertText(text);
		closeHistory(tr);

		view.dispatch(tr);
		view.focus();
	};
