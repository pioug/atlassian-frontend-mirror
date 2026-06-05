import type { Node } from '@atlaskit/editor-prosemirror/model';

export function isBulletList(node: Node | null | undefined): boolean {
	return Boolean(node && node.type && 'bulletList' === node.type.name);
}
