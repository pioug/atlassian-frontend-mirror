import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export function isTextAtPos(pos: number): (props: { tr: Transaction }) => boolean {
	return ({ tr }: { tr: Transaction }) => {
		const node = tr.doc.nodeAt(pos);
		return !!node && node.isText;
	};
}
