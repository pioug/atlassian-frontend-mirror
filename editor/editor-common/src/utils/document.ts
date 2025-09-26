import clamp from 'lodash/clamp';

import type { Node, ResolvedPos, Fragment } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	ReadonlyTransaction,
	TextSelection,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';

import { isEmptyParagraph } from './editor-core-utils';

type ChangedFn = (node: Node, pos: number, parent: Node | null, index: number) => boolean | void;

export const getStepRange = (
	transaction: Transaction | ReadonlyTransaction,
): { from: number; to: number } | null => {
	let from = -1;
	let to = -1;

	transaction.mapping.maps.forEach((stepMap, index) => {
		stepMap.forEach((oldStart, oldEnd) => {
			const newStart = transaction.mapping.slice(index).map(oldStart, -1);
			const newEnd = transaction.mapping.slice(index).map(oldEnd);

			from = newStart < from || from === -1 ? newStart : from;
			to = newEnd > to || to === -1 ? newEnd : to;

			// See ticket https://hello.jira.atlassian.cloud/browse/EDITOR-1223 and
			// PR https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/208332/overview
			// to see why use clamp here
			if (fg('aifc_create_enabled')) {
				const docSize = transaction.doc.content.size;
				from = clamp(from, 0, docSize);
				to = clamp(to, 0, docSize);
			}
		});
	});

	if (from !== -1) {
		return { from, to };
	}

	return null;
};

// Checks to see if the parent node is the document, ie not contained within another entity
export function hasDocAsParent($anchor: ResolvedPos): boolean {
	return $anchor.depth === 1;
}

/**
 * Checks if a node looks like an empty document
 */
export function isEmptyDocument(node: Node): boolean {
	const nodeChild = node.content.firstChild;
	if (node.childCount !== 1 || !nodeChild) {
		return false;
	}
	return isEmptyParagraph(nodeChild);
}

export function bracketTyped(state: EditorState) {
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

export function nodesBetweenChanged(
	tr: Transaction | ReadonlyTransaction,
	f: ChangedFn,
	startPos?: number,
) {
	const stepRange = getStepRange(tr);
	if (!stepRange) {
		return;
	}

	tr.doc.nodesBetween(stepRange.from, stepRange.to, f, startPos);
}

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

export const isSelectionEndOfParagraph = (state: EditorState): boolean =>
	state.selection.$to.parent.type === state.schema.nodes.paragraph &&
	state.selection.$to.pos === state.doc.resolve(state.selection.$to.pos).end();

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
export const isReplaceDocOperation = (
	transactions: readonly Transaction[],
	oldState: EditorState,
) => {
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

/**
 * Compares two ProseMirror documents for equality, ignoring attributes
 * which don't affect the document structure.
 *
 * This is almost a copy of the .eq() PM function - tweaked to ignore attrs
 *
 * @param doc1 PMNode
 * @param doc2 PMNode
 * @returns boolean
 */
export function areNodesEqualIgnoreAttrs(node1: Node, node2: Node): boolean {
	if (node1.isText) {
		return node1.eq(node2);
	}
	return (
		node1 === node2 ||
		(node1.hasMarkup(node2.type, node1.attrs, node2.marks) &&
			areFragmentsEqual(node1.content, node2.content))
	);
}

function areFragmentsEqual(frag1: Fragment, frag2: Fragment): boolean {
	if (frag1.content.length !== frag2.content.length) {
		return false;
	}
	let childrenEqual = true;
	frag1.content.forEach((child, i) => {
		const otherChild = frag2.child(i);
		if (child === otherChild || (otherChild && areNodesEqualIgnoreAttrs(child, otherChild))) {
			return;
		}
		childrenEqual = false;
	});
	return childrenEqual;
}
