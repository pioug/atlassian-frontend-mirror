import type { Node } from '@atlaskit/editor-prosemirror/model';

export function isListItemNode(node: Node | null | undefined): boolean {
	return Boolean(node && node.type && 'listItem' === node.type.name);
}
