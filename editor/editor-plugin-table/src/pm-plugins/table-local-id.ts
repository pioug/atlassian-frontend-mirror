/**
 * A plugin for ensuring tables always have unique local IDs, and to
 * preserve/not regenerate them when they are being cut and paste around the
 * document.
 *
 * More broadly, this plugin should be generalised so it can solve this ‘unique
 * id’ problem across the codebase for any node, but for now this will live on
 * its own solving only for tables.
 *
 * TODO: https://product-fabric.atlassian.net/browse/ED-12714
 *
 */
import rafSchedule from 'raf-schd';

import { uuid } from '@atlaskit/adf-schema';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { stepHasSlice } from '@atlaskit/editor-common/utils';
import type { Node as ProsemirrorNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

interface TableLocalIdPluginState {
	// One time parse for initial load with existing tables without localIds
	parsedForLocalIds: boolean;
}

const pluginKey = new PluginKey<TableLocalIdPluginState>('tableLocalIdPlugin');
const getPluginState = (state: EditorState): TableLocalIdPluginState | undefined | null =>
	state && pluginKey.getState(state);

/**
 * Ensures uniqueness of `localId`s on tables being created or edited
 */
const createPlugin = (dispatch: Dispatch) =>
	new SafePlugin<TableLocalIdPluginState>({
		key: pluginKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init() {
				return {
					parsedForLocalIds: false,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply(tr, pluginState) {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					const keys = Object.keys(meta) as Array<keyof TableLocalIdPluginState>;
					// @ts-ignore - Workaround for help-center local consumption

					const changed = keys.some((key) => {
						return pluginState[key] !== meta[key];
					});

					if (changed) {
						const newState = { ...pluginState, ...meta };

						dispatch(pluginKey, newState);
						return newState;
					}
				}

				return pluginState;
			},
		},
		view: () => {
			return {
				/**
				 * Utilise the update cycle for _one_ scan through an initial doc
				 * to ensure existing tables without IDs get them when this plugin is
				 * enabled.
				 *
				 * This entire block can be skipped if we simply remove the `checkIsAddingTable`
				 * check in appendTransaction, but that comes with 2 cons:
				 *
				 * 1. require a transaction before we actually add the local IDs
				 * 2. ever slightly more unncessary checks
				 *
				 * Finally, this never happens in practice when utilising this in
				 * confluence, as the collab/synchrony initialisation process will
				 * trigger a transaction which adds tables, and thus this plugin will
				 * add/dedupe the necessary IDs. But general usage of the editor
				 * without collab should still solve for IDs.
				 */
				// @ts-ignore - Workaround for help-center local consumption

				update(editorView) {
					const { state } = editorView;
					const pluginState = getPluginState(state);
					if (!pluginState) {
						return;
					}
					const parsed = pluginState.parsedForLocalIds;
					if (parsed) {
						return;
					}

					const { table } = state.schema.nodes;
					rafSchedule(() => {
						const tr = editorView.state.tr;
						let tableIdWasAdded = false;
						// @ts-ignore - Workaround for help-center local consumption

						editorView.state.doc.descendants((node, pos) => {
							const isTable = node.type === table;
							const localId = node.attrs.localId;
							if (isTable && !localId) {
								tableIdWasAdded = true;
								tr.setNodeMarkup(pos, undefined, {
									...node.attrs,
									localId: uuid.generate(),
								});
								return false;
							}
							/**
							 * Otherwise continue traversing, we can encounter tables nested in
							 * expands/bodiedExtensions
							 */
							return true;
						});
						if (tableIdWasAdded) {
							tr.setMeta('addToHistory', false);
							editorView.dispatch(tr);
						}
					})();

					editorView.dispatch(
						state.tr.setMeta(pluginKey, {
							parsedForLocalIds: true,
						}),
					);
				},
			};
		},
		// @ts-ignore - Workaround for help-center local consumption

		appendTransaction: (transactions, _oldState, newState) => {
			let modified = false;
			const tr = newState.tr;
			const { table } = newState.schema.nodes;

			const addedTableNodes: Set<ProsemirrorNode> = new Set();
			const addedTableNodePos: Map<ProsemirrorNode, number> = new Map();
			const localIds: Set<string> = new Set();

			// @ts-ignore - Workaround for help-center local consumption

			transactions.forEach((transaction) => {
				if (!transaction.docChanged) {
					return;
				}

				// Don't interfere with cut as it clashes with fixTables & we don't need
				// to handle any extra cut cases in this plugin
				const uiEvent = transaction.getMeta('uiEvent');
				if (uiEvent === 'cut') {
					return;
				}

				/** Get the tables we are adding and their position */
				for (const step of transaction.steps) {
					if (!stepHasSlice(step)) {
						continue;
					}

					// @ts-ignore - Workaround for help-center local consumption

					step.slice.content.descendants((node) => {
						if (node.type === table) {
							addedTableNodes.add(node);
						}

						return true;
					});
				}
			});

			if (!addedTableNodes.size) {
				return;
			}

			// Get the existing localIds on the page
			// @ts-ignore - Workaround for help-center local consumption

			newState.doc.descendants((node, pos) => {
				// Skip if this is position of added table
				if (addedTableNodes.has(node)) {
					addedTableNodePos.set(node, pos);
					return false;
				}

				if (node.type !== table) {
					return true;
				}

				localIds.add(node.attrs.localId);

				// can't have table within a table
				return false;
			});

			// If the added nodes have duplicate id, generate a new one
			for (const node of addedTableNodes) {
				if (!node.attrs.localId || localIds.has(node.attrs.localId)) {
					const pos = addedTableNodePos.get(node);

					if (pos === undefined) {
						continue;
					}

					tr.setNodeMarkup(pos, undefined, {
						...node.attrs,
						localId: uuid.generate(),
					});

					modified = true;
				}
			}

			if (modified) {
				return tr;
			}

			return;
		},
	});

export { createPlugin };
