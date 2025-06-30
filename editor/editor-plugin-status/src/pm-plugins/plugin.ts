import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';

import { StatusNodeView as StatusNodeViewVanilla } from '../nodeviews/StatusNodeView';
import type { StatusPluginOptions, StatusState } from '../types';

import { pluginKey } from './plugin-key';
import { isEmptyStatus, mayGetStatusAtSelection } from './utils';

const createPlugin = (
	pmPluginFactoryParams: PMPluginFactoryParams,
	options?: StatusPluginOptions,
) =>
	new SafePlugin({
		state: {
			init: () => ({
				isNew: false,
				showStatusPickerAt: null,
				focusStatusInput: false,
			}),
			apply(tr, state: StatusState, oldEditorState) {
				const meta = tr.getMeta(pluginKey);

				if (meta) {
					const newState = { ...state, ...meta };

					pmPluginFactoryParams.dispatch(pluginKey, newState);
					return newState;
				}

				if (tr.docChanged && state.showStatusPickerAt) {
					const { pos, deleted } = tr.mapping.mapResult(state.showStatusPickerAt);

					const showStatusPickerAt = deleted ? null : pos;

					const newState = {
						...state,
						showStatusPickerAt,
					};

					if (newState.showStatusPickerAt !== state.showStatusPickerAt) {
						pmPluginFactoryParams.dispatch(pluginKey, newState);

						return newState;
					}
				}

				if (tr.selectionSet) {
					// Change in selection, while status picker was open, update state, if required.
					const selectionFrom = tr.selection.from;
					const nodeAtSelection = tr.doc.nodeAt(selectionFrom);
					let showStatusPickerAt = null;
					if (
						nodeAtSelection &&
						nodeAtSelection.type === oldEditorState.schema.nodes.status &&
						tr.selection instanceof NodeSelection
					) {
						showStatusPickerAt = selectionFrom;
					}
					if (showStatusPickerAt !== state.showStatusPickerAt) {
						const newState = {
							...state,
							isNew: false,
							showStatusPickerAt,
							focusStatusInput: false,
						};
						pmPluginFactoryParams.dispatch(pluginKey, newState);
						return newState;
					}
				}
				return state;
			},
		},
		filterTransaction: (tr, state) => {
			// if it is a selection change transaction, and selection changes from node to text
			if (
				tr.selectionSet &&
				!tr.steps.length &&
				tr.isGeneric &&
				tr.selection instanceof TextSelection &&
				state.selection instanceof NodeSelection
			) {
				const { isNew, showStatusPickerAt } = pluginKey.getState(state) || {};
				const nodeAtSelection = tr.doc.nodeAt(tr.selection.from);
				// prevent changing node selection to text selection on dom change right after inserting status
				// if newly selected status is selected with status picker opened
				if (
					isNew &&
					showStatusPickerAt &&
					nodeAtSelection &&
					nodeAtSelection.type === state.schema.nodes.status
				) {
					return false;
				}
			}
			return true;
		},
		appendTransaction: (
			transactions: readonly Transaction[],
			oldEditorState: EditorState,
			newEditorState: EditorState,
		) => {
			let changed = false;
			const tr = newEditorState.tr;

			/**
			 * When user start creating status, and, when users navigates away
			 *  while empty, then we want to remove empty ("set a status") status.
			 * But when transaction to add empty status happens from undo/redo
			 *  we don't want to remove it.
			 */
			if (transactions.find((tr) => tr.selectionSet && !tr.getMeta(pmHistoryPluginKey))) {
				const oldStatus = mayGetStatusAtSelection(oldEditorState.selection);
				const newStatus = mayGetStatusAtSelection(newEditorState.selection);
				if (oldStatus && ((newStatus && oldStatus.localId !== newStatus.localId) || !newStatus)) {
					if (isEmptyStatus(oldStatus)) {
						const pos = oldEditorState.selection.from;
						tr.delete(tr.mapping.map(pos), tr.mapping.map(pos + 1));
						changed = true;
					}
				}
			}
			return changed ? tr : undefined;
		},
		key: pluginKey,
		props: {
			nodeViews: {
				status: (node) => {
					return new StatusNodeViewVanilla(node, pmPluginFactoryParams.getIntl());
				},
			},
		},
	});

export default createPlugin;
