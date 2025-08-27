import { uuid } from '@atlaskit/adf-schema';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { stepHasSlice } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

export const localIdPluginKey = new PluginKey('localIdPlugin');

// Fallback for Safari which doesn't support requestIdleCallback
const requestIdleCallbackWithFallback = (callback: () => void) => {
	if (typeof requestIdleCallback !== 'undefined') {
		requestIdleCallback(callback);
	} else {
		// Fallback to requestAnimationFrame for Safari
		requestAnimationFrame(callback);
	}
};

export const createPlugin = () => {
	return new SafePlugin({
		key: localIdPluginKey,
		view: (editorView) => {
			/**
			 * This performs a one-time scan of the document to add local IDs
			 * to nodes that don't have them. It's designed to run only once per
			 * editor instance to avoid performance issues.
			 */
			requestIdleCallbackWithFallback(() => {
				const tr = editorView.state.tr;
				let localIdWasAdded = false;

				const { text, hardBreak, mediaGroup } = editorView.state.schema.nodes;
				// Media group is ignored for now
				// https://bitbucket.org/atlassian/adf-schema/src/fb2236147a0c2bc9c8efbdb75fd8f8c411df44ba/packages/adf-schema/src/next-schema/nodes/mediaGroup.ts#lines-12
				const ignoredNodeTypes = mediaGroup
					? [text.name, hardBreak.name, mediaGroup.name]
					: [text.name, hardBreak.name];

				editorView.state.doc.descendants((node: PMNode, pos) => {
					// Skip text nodes, hard breaks and nodes that already have local IDs
					if (!ignoredNodeTypes.includes(node.type.name) && !node.attrs.localId) {
						localIdWasAdded = true;
						addLocalIdToNode(pos, tr);
					}
					return true; // Continue traversing
				});

				// Only dispatch the transaction if we actually added local IDs
				if (localIdWasAdded) {
					tr.setMeta('addToHistory', false);
					editorView.dispatch(tr);
				}
			});

			return {
				update: () => {},
			};
		},
		/**
		 * Handles adding local IDs to new nodes that are created and have the localId attribute
		 * This ensures uniqueness of localIds on nodes being created or edited
		 */
		appendTransaction: (transactions, _oldState, newState) => {
			let modified = false;
			const tr = newState.tr;
			const { text, hardBreak, mediaGroup } = newState.schema.nodes;
			// Media group is ignored for now
			// https://bitbucket.org/atlassian/adf-schema/src/fb2236147a0c2bc9c8efbdb75fd8f8c411df44ba/packages/adf-schema/src/next-schema/nodes/mediaGroup.ts#lines-12
			const ignoredNodeTypes = [text?.name, hardBreak?.name, mediaGroup?.name];
			const addedNodes = new Set<PMNode>();
			const addedNodePos = new Map<PMNode, number>();
			const localIds = new Set<string>();

			// Process only the nodes added in the transactions
			transactions.forEach((transaction) => {
				if (!transaction.docChanged) {
					return;
				}

				if (transaction.getMeta('uiEvent') === 'cut') {
					return;
				}

				transaction.steps.forEach((step) => {
					if (!stepHasSlice(step)) {
						return;
					}
					step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
						// Scan the changed range to find all nodes
						tr.doc.nodesBetween(newStart, Math.min(newEnd, tr.doc.content.size), (node, pos) => {
							if (ignoredNodeTypes.includes(node.type.name)) {
								return true;
							}

							modified = true;

							if (fg('platform_editor_use_localid_dedupe')) {
								// Always add to addedNodes for duplicate prevention
								addedNodes.add(node);
								addedNodePos.set(node, pos);
							} else {
								if (!node?.attrs.localId) {
									addLocalIdToNode(pos, tr);
								}
							}

							return true;
						});
					});
				});
			});

			if (addedNodes.size > 0 && fg('platform_editor_use_localid_dedupe')) {
				newState.doc.descendants((node, pos) => {
					if (addedNodes.has(node)) {
						return true;
					}

					localIds.add(node.attrs.localId);
					return true;
				});

				for (const node of addedNodes) {
					if (!node.attrs.localId || localIds.has(node.attrs.localId)) {
						const pos = addedNodePos.get(node);
						if (pos !== undefined) {
							addLocalIdToNode(pos, tr);
							modified = true;
						}
					}
				}
			}

			return modified ? tr : undefined;
		},
	});
};
/**
 * Adds a local ID to a ProseMirror node
 *
 * This utility function updates a node's attributes to include a unique local ID.
 *
 * @param pos - The position of the node in the document
 * @param tr - The transaction to apply the change to
 */
export const addLocalIdToNode = (pos: number, tr: Transaction) => {
	tr.setNodeAttribute(pos, 'localId', uuid.generate());
};
