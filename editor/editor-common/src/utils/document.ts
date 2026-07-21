import type { Node, Fragment, Mark } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	ReadonlyTransaction,
	TextSelection,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { getStepRange } from './getStepRange';
import { hasDocAsParent } from './hasDocAsParent';
type ChangedFn = (node: Node, pos: number, parent: Node | null, index: number) => boolean | void;

export function bracketTyped(state: EditorState): boolean {
	const { selection } = state;
	const { $cursor, $anchor } = selection as TextSelection;

	if (!$cursor) {
		return false;
	}
	const node = $cursor.nodeBefore;

	if (!node) {
		return false;
	}

	if (node.type.name === 'text' && node.text === '{') {
		const paragraphNode = $anchor.node();
		return paragraphNode.marks.length === 0 && hasDocAsParent($anchor);
	}

	return false;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function nodesBetweenChanged(
	tr: Transaction | ReadonlyTransaction,
	f: ChangedFn,
	startPos?: number,
): void {
	const stepRange = getStepRange(tr);
	if (!stepRange) {
		return;
	}

	tr.doc.nodesBetween(stepRange.from, stepRange.to, f, startPos);
}

function getChangedNodesIn({
	tr,
	doc,
}: {
	doc: Node;
	tr: ReadonlyTransaction | Transaction;
}): { node: Node; pos: number }[] {
	const nodes: { node: Node; pos: number }[] = [];
	const stepRange = getStepRange(tr);

	if (!stepRange) {
		return nodes;
	}

	const from = Math.min(doc.nodeSize - 2, stepRange.from);
	const to = Math.min(doc.nodeSize - 2, stepRange.to);

	doc.nodesBetween(from, to, (node, pos) => {
		nodes.push({ node, pos });
	});

	return nodes;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getChangedNodes(
	tr: ReadonlyTransaction | Transaction,
): { node: Node; pos: number }[] {
	return getChangedNodesIn({
		tr: tr,
		doc: tr.doc,
	});
}

type __ReplaceStep = ReplaceStep & {
	from: number;
	// Properties `to` and `from` are private attributes of ReplaceStep.
	to: number;
};

// When document first load in Confluence, initially it is an empty document
// and Collab service triggers a transaction to replace the empty document with the real document that should be rendered.
// isReplaceDocumentOperation is checking if the transaction is the one that replace the empty document with the real document
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isReplaceDocOperation = (
	transactions: readonly Transaction[],
	oldState: EditorState,
): boolean => {
	return transactions.some((tr) => {
		if (tr.getMeta('replaceDocument')) {
			return true;
		}

		const hasStepReplacingEntireDocument = tr.steps.some((step) => {
			if (!(step instanceof ReplaceStep)) {
				return false;
			}

			const isStepReplacingFromDocStart = (step as __ReplaceStep).from === 0;
			const isStepReplacingUntilTheEndOfDocument =
				(step as __ReplaceStep).to === oldState.doc.content.size;

			if (!isStepReplacingFromDocStart || !isStepReplacingUntilTheEndOfDocument) {
				return false;
			}
			return true;
		});

		return hasStepReplacingEntireDocument;
	});
};

function marksEqualInOrder(m1: readonly Mark[], m2: readonly Mark[]): boolean {
	if (m1.length !== m2.length) return false;
	return m1.every((m, i) => m.eq(m2[i]));
}

function marksEqualIgnoringOrder(m1: readonly Mark[], m2: readonly Mark[]): boolean {
	if (m1.length !== m2.length) {
		return false;
	}
	const m2Used = new Set<number>();
	for (const mark1 of m1) {
		const idx = m2.findIndex((mark2, i) => !m2Used.has(i) && mark1.eq(mark2));
		if (idx === -1) {
			return false;
		}
		m2Used.add(idx);
	}
	return true;
}
/**
 * Compares two ProseMirror documents for equality, ignoring attributes
 * which don't affect the document structure.
 *
 * This is almost a copy of the .eq() PM function - tweaked to ignore attrs
 *
 * @param doc1 PMNode
 * @param doc2 PMNode
 * @param attributesToIgnore Specific array of attribute keys to ignore - defaults to ignoring all
 * @param opts.ignoreMarkOrder If mark order should be ignored to still be equal (e.g. reversed annotation marks). Defaults to true.
 * @returns boolean
 */

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function areNodesEqualIgnoreAttrs(
	node1: Node,
	node2: Node,
	attributesToIgnore?: string[],
	opts?: {
		ignoreMarkOrder?: boolean;
	},
): boolean {
	const ignoreMarkOrder = opts?.ignoreMarkOrder ?? true;

	if (node1.isText) {
		if (ignoreMarkOrder) {
			return node1.text === node2.text && marksEqualIgnoringOrder(node1.marks, node2.marks);
		}
		return node1.eq(node2);
	}

	const marksEqual = ignoreMarkOrder
		? marksEqualIgnoringOrder(node1.marks, node2.marks)
		: marksEqualInOrder(node1.marks, node2.marks);

	// If no attributes to ignore, compare all attributes
	if (!attributesToIgnore || attributesToIgnore.length === 0) {
		return (
			node1 === node2 ||
			(node1.hasMarkup(node2.type, node1.attrs, node1.marks) &&
				marksEqual &&
				areFragmentsEqual(node1.content, node2.content, undefined, opts))
		);
	}

	// Build attrs to compare by excluding ignored attributes
	const attrsToCompare: Record<string, unknown> = { ...node2.attrs };
	const ignoreSet = new Set(attributesToIgnore);
	for (const key in node2.attrs) {
		if (ignoreSet.has(key)) {
			attrsToCompare[key] = node1.attrs[key];
		}
	}
	return (
		node1 === node2 ||
		(node1.type === node2.type &&
			node1.hasMarkup(node2.type, attrsToCompare, node1.marks) &&
			marksEqual &&
			areFragmentsEqual(node1.content, node2.content, attributesToIgnore, opts))
	);
}

function areFragmentsEqual(
	frag1: Fragment,
	frag2: Fragment,
	attributesToIgnore?: string[],
	opts?: { ignoreMarkOrder?: boolean },
): boolean {
	if (frag1.content.length !== frag2.content.length) {
		return false;
	}
	let childrenEqual = true;
	frag1.content.forEach((child, i) => {
		const otherChild = frag2.child(i);
		if (
			child === otherChild ||
			(otherChild && areNodesEqualIgnoreAttrs(child, otherChild, attributesToIgnore, opts))
		) {
			return;
		}
		childrenEqual = false;
	});
	return childrenEqual;
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getStepRange } from './getStepRange';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { hasDocAsParent } from './hasDocAsParent';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isEmptyDocument } from './isEmptyDocument';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { hasVisibleContent } from './hasVisibleContent';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isSelectionEndOfParagraph } from './isSelectionEndOfParagraph';
