import type { Node } from '@atlaskit/editor-prosemirror/model';

export function isParagraphNode(node: Node | null | undefined): boolean {
	return Boolean(node && node.type && 'paragraph' === node.type.name);
}
