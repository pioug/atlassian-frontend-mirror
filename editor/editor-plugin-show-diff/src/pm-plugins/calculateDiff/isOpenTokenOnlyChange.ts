import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Whether a change spans nothing but a block node's open token, so its deleted side carries no
 * content.
 *
 * The attribute-aware token encoder folds a node's diffable attributes into its open token, so a
 * same-type replacement — an AI suggestion rewriting a code block — is reported as two changes: one
 * over the single position of that token, carrying the attribute change, and one for the content.
 * Slicing the first yields the node with none of its content, which leaves the deleted-content
 * widget nothing to draw but an empty copy of the block (EDITOR-8912). The content change is a
 * change of its own and is decorated in place.
 *
 * A whole node is not matched: its range covers its close token too. Neither is an empty leaf (a
 * `rule`, a `blockCard`), which is one position but slices closed rather than open.
 */
export const isOpenTokenOnlyChange = ({
	change,
	originalDoc,
}: {
	change: { fromA: number; toA: number };
	originalDoc: PMNode;
}): boolean => {
	if (change.toA - change.fromA !== 1) {
		return false;
	}
	const slice = originalDoc.slice(change.fromA, change.toA);
	// `childCount === 1` already means `firstChild` is there; the optional chain is for the type,
	// which has it nullable.
	const node = slice.content.firstChild;
	return (
		(slice.openStart > 0 || slice.openEnd > 0) &&
		slice.content.childCount === 1 &&
		node?.isBlock === true &&
		node.content.size === 0
	);
};
