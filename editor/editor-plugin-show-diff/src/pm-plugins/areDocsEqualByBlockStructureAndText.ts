import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * Returns a copy of the document with all marks removed from all text.
 * This normalises mark fragmentation — e.g. annotation marks reordering can split
 * a single text run into many text nodes, making structural comparison unreliable.
 * After stripping, ProseMirror will merge adjacent text nodes so childCounts are stable.
 */
function stripMarks(doc: PMNode): PMNode {
	const tr = new Transform(doc);
	tr.removeMark(0, doc.content.size);
	return tr.doc;
}

/**
 * Returns true if both (mark-stripped) nodes have the same block tree structure (node type and child count at every level)
 */
function isBlockStructureEqual(node1: PMNode, node2: PMNode): boolean {
	if (node1.type !== node2.type || node1.childCount !== node2.childCount) {
		return false;
	}
	for (let i = 0; i < node1.childCount; i++) {
		if (!isBlockStructureEqual(node1.child(i), node2.child(i))) {
			return false;
		}
	}
	return true;
}

/**
 * Looser equality for "safe diff" cases: same full text content and same block structure
 * (e.g. text moved across text-node boundaries). Used when strict areNodesEqualIgnoreAttrs fails.
 * This is safe because we ensure decorations get applied to valid positions.
 *
 * Marks are intentionally ignored — two documents that differ only in mark application
 * (e.g. bold/italic boundaries or annotation mark ordering) are considered equal here.
 * Both documents are mark-stripped before comparison so that mark-driven text fragmentation
 * does not produce false inequalities.
 */
export function areDocsEqualByBlockStructureAndText(doc1: PMNode, doc2: PMNode): boolean {
	if (doc1.textContent !== doc2.textContent) {
		return false;
	}
	if (expValEquals('platform_editor_show_diff_improvements', 'isEnabled', true)) {
		// Strip marks before comparing so that mark-driven text fragmentation
		// (e.g. annotation mark reordering producing different childCounts) does not
		// cause false inequalities.
		const stripped1 = stripMarks(doc1);
		const stripped2 = stripMarks(doc2);
		return doc1.nodeSize === doc2.nodeSize && isBlockStructureEqual(stripped1, stripped2);
	}
	return doc1.nodeSize === doc2.nodeSize && isBlockStructureEqual(doc1, doc2);
}
