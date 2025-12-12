// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid
import uuid from 'uuid';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type EditorState,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

class ObjHash {
	static cache = new WeakMap<PMNode, string>();

	static getForNode(node: PMNode): string {
		if (this.cache.has(node)) {
			return this.cache.get(node) || '';
		}
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid
		const uniqueId = uuid();
		this.cache.set(node, uniqueId);
		return uniqueId;
	}
}

const getNodeAnchor = (node: PMNode): string => {
	const handleId = ObjHash.getForNode(node);
	return `--table-${node.type.name}-${handleId}`;
};

const createTableAnchorDecorations = (state: EditorState): DecorationSet => {
	const decs: Decoration[] = [];

	state.doc.nodesBetween(0, state.doc.content.size, (node, pos, parent, index) => {
		const isTableHeader = node.type.name === 'tableHeader';
		const isTableRow = node.type.name === 'tableRow';
		const isParentTableRow = parent?.type.name === 'tableRow';

		// only apply to header cells and the first row of a table, for performance reasons
		if ((isTableRow && index === 0) || isTableHeader) {
			const anchorName = getNodeAnchor(node);

			decs.push(
				Decoration.node(pos, pos + node.nodeSize, {
					'data-node-anchor': anchorName,
				}),
			);
		}

		// only decend if there is a possible table row or table header node after the current node, for performance reasons
		return !(isTableHeader || isParentTableRow);
	});

	return DecorationSet.create(state.doc, decs);
};

export const pluginKey = new PluginKey('tableAnchorNamesPlugin');

export const createPlugin = () => {
	return new SafePlugin({
		state: {
			init: (_config, state: EditorState) => {
				return createTableAnchorDecorations(state);
			},
			apply: (tr: ReadonlyTransaction, decorationSet, _, newState) => {
				if (tr.docChanged) {
					return createTableAnchorDecorations(newState);
				}
				return decorationSet;
			},
		},
		key: pluginKey,
		props: {
			decorations: (state: EditorState) => pluginKey.getState(state) || DecorationSet.empty,
		},
	});
};
