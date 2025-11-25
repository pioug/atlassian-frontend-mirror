/**
 * This plugin ensures that certain nodes (such as tables, and various extension ones)
 * have a unique `localId` attribute value for `fragment` marks.
 * It also ensures the preservation of these IDs when nodes are being cut-and-pasted
 * around the document.
 *
 * The implementation has been _heavily_ borrowed from
 * - packages/editor/editor-core/src/plugins/table/pm-plugins/table-local-id.ts
 */

import { uuid } from '@atlaskit/adf-schema';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { getChangedNodes } from '@atlaskit/editor-common/utils';
import type { NodeType, Node as ProsemirrorNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

const pluginKey = new PluginKey('fragmentMarkConsistencyPlugin');

const getNodesSupportingFragmentMark = (schema: Schema): NodeType[] => {
	const { table, extension, bodiedExtension, inlineExtension } = schema.nodes;
	return [table, extension, bodiedExtension, inlineExtension];
};

/**
 * Ensures presence of `fragment` mark on certain node types and the uniqueness of their `localId` attributes
 */
export const createPlugin = (dispatch: Dispatch) =>
	new SafePlugin({
		key: pluginKey,
		// @ts-ignore - Workaround for help-center local consumption

		appendTransaction: (transactions, _oldState, newState) => {
			let modified = false;
			const tr = newState.tr;

			const { fragment } = newState.schema.marks;
			const supportedNodeTypes = getNodesSupportingFragmentMark(newState.schema);

			const addedSupportedNodes: Set<ProsemirrorNode> = new Set();
			const addedSupportedNodesPos: Map<ProsemirrorNode, number> = new Map();
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

				const changedNodes = getChangedNodes(transaction);
				for (const { node } of changedNodes) {
					if (!supportedNodeTypes.includes(node.type)) {
						continue;
					}

					addedSupportedNodes.add(node);
				}
			});

			if (!addedSupportedNodes.size) {
				return;
			}

			// Get existing fragment marks localIds on the page
			// @ts-ignore - Workaround for help-center local consumption

			newState.doc.descendants((node, pos) => {
				if (addedSupportedNodes.has(node)) {
					addedSupportedNodesPos.set(node, pos);
					return true;
				}

				if (!supportedNodeTypes.includes(node.type)) {
					return true;
				}

				// @ts-ignore - Workaround for help-center local consumption

				const existingFragmentMark = node.marks.find((mark) => mark.type === fragment);
				if (!existingFragmentMark) {
					// continue traversing
					return true;
				}

				localIds.add(existingFragmentMark.attrs.localId);

				return true;
			});

			// If an added node has localId that collides with existing node, generate new localId
			for (const node of addedSupportedNodes) {
				const pos = addedSupportedNodesPos.get(node);

				if (pos === undefined) {
					continue;
				}

				// @ts-ignore - Workaround for help-center local consumption

				const existingFragmentMark = node.marks.find((mark) => mark.type === fragment);
				if (!existingFragmentMark) {
					continue;
				}

				if (localIds.has(existingFragmentMark.attrs.localId)) {
					tr.setNodeMarkup(
						pos,
						undefined,
						node.attrs,
						// @ts-ignore - Workaround for help-center local consumption

						node.marks.map((mark) => {
							if (mark.type !== fragment) {
								return mark;
							}
							const fragmentMark = fragment.create({
								...mark.attrs,
								localId: uuid.generate(),
								name: null,
							});

							return fragmentMark;
						}),
					);

					modified = true;
				}
			}

			if (modified) {
				return tr;
			}

			return;
		},
	});
