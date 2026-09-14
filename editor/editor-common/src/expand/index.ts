import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorCommand } from '../types';

// Used to store the state of the new single player expand node
export const expandedState: WeakMap<PmNode, boolean> = new WeakMap<PmNode, boolean>();

// EDITOR-7926: lives here (not editor-plugin-expand) so plugins can drive expand open/close without
// depending on the expand plugin, which would be a circular reference.
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const TOGGLE_EXPAND_RANGE_META_KEY = 'toggleExpandRange';

/** Opens/closes all expand/nestedExpand nodes in a range via the shared expand meta signal. */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const toggleExpandRange =
	(from?: number, to?: number, open: boolean = true): EditorCommand =>
	({ tr }) => {
		const { expand, nestedExpand } = tr.doc.type.schema.nodes;
		const fromClamped = from && from >= 0 ? from : 0;
		const toClamped = to && to <= tr.doc.content.size ? to : tr.doc.content.size;

		const positions: number[] = [];
		tr.doc.nodesBetween(fromClamped, toClamped, (node, pos) => {
			if ([expand, nestedExpand].includes(node.type)) {
				expandedState.set(node, open);
				positions.push(pos);
			}
		});

		if (positions.length === 0) {
			// No expand nodes found in the range — nothing to dispatch.
			return null;
		}

		// Set meta so the expand PM plugin can add node decorations.
		// This ensures ExpandNodeView.update() receives the decoration and visually
		// opens or closes the expand.
		tr.setMeta(TOGGLE_EXPAND_RANGE_META_KEY, { positions, open });
		return tr;
	};

// used to determine if the expand is expanded or collapsed
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isExpandCollapsed = (node: PmNode): boolean => {
	// @ts-ignore - TS2869 TypeScript 5.9.2 upgrade
	return !expandedState.get(node) ?? false;
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getNextNodeExpandPos = (
	editorView: EditorView,
	selection: Selection,
): number | undefined => {
	let parentNode = findParentNodeOfType([
		editorView.state.schema.nodes.listItem,
		editorView.state.schema.nodes.heading,
		editorView.state.schema.nodes.blockquote,
		editorView.state.schema.nodes.taskItem,
		editorView.state.schema.nodes.mediaSingle,
	])(selection);

	const tableRowNode = findParentNodeOfType([editorView.state.schema.nodes.tableRow])(selection);

	if (tableRowNode) {
		parentNode = tableRowNode;
	}

	if (!parentNode) {
		const paragraphNode = findParentNodeOfType([editorView.state.schema.nodes.paragraph])(
			selection,
		);

		if (!paragraphNode) {
			return;
		}
		parentNode = paragraphNode;
	}

	if (!parentNode) {
		return undefined;
	}

	const endPosOffset =
		parentNode && ['taskItem', 'listItem', 'tableRow'].includes(parentNode.node.type.name) ? 1 : 0;

	const endOfTextblockPos = parentNode.start + parentNode.node.content.size + endPosOffset + 1;

	if (endOfTextblockPos > editorView.state.doc.content.size) {
		return undefined;
	}

	const $endOfTextblockPos = editorView.state.doc.resolve(endOfTextblockPos);

	if (
		$endOfTextblockPos?.nodeAfter &&
		['expand', 'nestedExpand'].includes($endOfTextblockPos.nodeAfter.type.name)
	) {
		return endOfTextblockPos + 1;
	}
	return undefined;
};
