import { uuid } from '@atlaskit/adf-schema';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey, type Transaction } from '@atlaskit/editor-prosemirror/state';

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

				const { text, hardBreak } = editorView.state.schema.nodes;
				const ignoredNodeTypes = [text.name, hardBreak.name];

				editorView.state.doc.descendants((node: PMNode, pos) => {
					// Skip text nodes, hard breaks and nodes that already have local IDs
					if (!ignoredNodeTypes.includes(node.type.name) && !node.attrs.localId) {
						localIdWasAdded = true;
						addLocalIdToNode(node, pos, tr);
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
	});
};

/**
 * Adds a local ID to a ProseMirror node
 *
 * This utility function updates a node's attributes to include a unique local ID.
 * It preserves all existing attributes and marks while adding the new localId.
 *
 * @param node - The ProseMirror node to add a local ID to
 * @param pos - The position of the node in the document
 * @param tr - The transaction to apply the change to
 * @returns The updated transaction with the node markup change
 */
export const addLocalIdToNode = (node: PMNode, pos: number, tr: Transaction) => {
	tr = tr.setNodeMarkup(
		pos,
		node.type,
		{
			...node.attrs,
			localId: uuid.generate(),
		},
		node.marks,
	);
};
