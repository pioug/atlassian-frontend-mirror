import type { Node } from '@atlaskit/editor-prosemirror/model';

export function isListNode(
	node: Node | null | undefined,
): node is Node & { type: { name: 'orderedList' | 'bulletList' } } {
	return Boolean(node && node.type && ['orderedList', 'bulletList'].includes(node.type.name));
}
