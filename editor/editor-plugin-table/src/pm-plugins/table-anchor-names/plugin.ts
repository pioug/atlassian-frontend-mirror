// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid
import uuid from 'uuid';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isCSSAnchorSupported, isCSSAttrAnchorSupported } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type EditorState,
	type ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
	let headerRowId: string;
	state.doc.nodesBetween(0, state.doc.content.size, (node, pos, parent, index) => {
		const isTableHeader = node.type.name === 'tableHeader';
		const isTableRow = node.type.name === 'tableRow';
		const isParentTableRow = parent?.type.name === 'tableRow';

		const isParentTableHeaderRow =
			parent?.type.name === 'tableRow' && headerRowId && parent?.attrs?.localId === headerRowId;

		const shouldAddDecorationToHeader = expValEquals(
			'platform_editor_table_sticky_header_patch_9',
			'isEnabled',
			true,
		)
			? isParentTableHeaderRow && isTableHeader
			: isTableHeader;
		const isFirstRow = isTableRow && index === 0;

		if (isFirstRow) {
			headerRowId = node.attrs.localId;
		}
		// only apply to header cells and the first row of a table, for performance reasons
		if (isFirstRow || shouldAddDecorationToHeader) {
			const anchorName = getNodeAnchor(node);
			const shouldAddAnchorNameInDecoration =
				!isCSSAttrAnchorSupported() &&
				isCSSAnchorSupported() &&
				fg('platform_editor_table_sticky_header_patch_8');

			const attributes = {
				'data-node-anchor': anchorName,
				style: `anchor-name: ${anchorName};`,
			};

			decs.push(
				Decoration.node(
					pos,
					pos + node.nodeSize,
					shouldAddAnchorNameInDecoration
						? attributes
						: {
								'data-node-anchor': anchorName,
							},
				),
			);
		}

		// only decend if there is a possible table row or table header node after the current node, for performance reasons
		return expValEquals('platform_editor_table_sticky_header_patch_9', 'isEnabled', true)
			? !(isTableHeader || isParentTableHeaderRow)
			: !(isTableHeader || isParentTableRow);
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
