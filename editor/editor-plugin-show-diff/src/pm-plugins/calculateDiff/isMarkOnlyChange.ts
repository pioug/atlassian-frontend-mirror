import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/** U+0000 cannot occur in ProseMirror text content, so this cannot collide with document text. */
const NODE_MARKER = '\u0000';

/**
 * Node types and text only; marks and attrs excluded.
 *
 * Text is unprefixed so adjacent runs concatenate — a run only splits because its marks differ, so
 * `strong("hello")` and `strong("hel") + em("lo")` must match. Attrs are excluded because a
 * reconstructed agent edit regenerates `localId`s; `getAttrChangeRanges` reports attrs separately.
 */
const markFreeSignature = (doc: PMNode, from: number, to: number): string => {
	const parts: string[] = [];
	doc.nodesBetween(from, to, (node, pos) => {
		if (node.isText) {
			const start = Math.max(pos, from) - pos;
			const end = Math.min(pos + node.nodeSize, to) - pos;
			parts.push((node.text ?? '').slice(start, end));
		} else {
			parts.push(`${NODE_MARKER}${node.type.name}`);
		}
		return true;
	});
	return parts.join('');
};

/**
 * Whether a change differs only in marks, with identical structure and text on both sides. Only
 * produced when a mark-aware token encoder is in use.
 */
export const isMarkOnlyChange = ({
	change,
	newDoc,
	originalDoc,
}: {
	change: { fromA: number; fromB: number; toA: number; toB: number };
	newDoc: PMNode;
	originalDoc: PMNode;
}): boolean => {
	const { fromA, toA, fromB, toB } = change;
	const isPureInsertionOrDeletion = toA === fromA || toB === fromB;
	if (isPureInsertionOrDeletion || toA - fromA !== toB - fromB) {
		return false;
	}
	return markFreeSignature(originalDoc, fromA, toA) === markFreeSignature(newDoc, fromB, toB);
};
