import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// Used to store the state of the new single player expand node
export const expandedState = new WeakMap<PmNode, boolean>();

// used to determine if the expand is expanded or collapsed
export const isExpandCollapsed = (node: PmNode): boolean => {
	// @ts-ignore - TS2869 TypeScript 5.9.2 upgrade
	return !expandedState.get(node) ?? false;
};

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
