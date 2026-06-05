import type { Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns false if node contains only empty inline nodes and hardBreaks.
 */
export function hasVisibleContent(node: Node): boolean {
	const isInlineNodeHasVisibleContent = (inlineNode: Node) => {
		return inlineNode.isText
			? !!inlineNode.textContent.trim()
			: inlineNode.type.name !== 'hardBreak';
	};

	if (node.isInline) {
		return isInlineNodeHasVisibleContent(node);
	} else if (node.isBlock && (node.isLeaf || node.isAtom)) {
		return true;
	} else if (!node.childCount) {
		return false;
	}

	for (let index = 0; index < node.childCount; index++) {
		const child = node.child(index);
		const invisibleNodeTypes = ['paragraph', 'text', 'hardBreak'];

		if (!invisibleNodeTypes.includes(child.type.name) || hasVisibleContent(child)) {
			return true;
		}
	}

	return false;
}
