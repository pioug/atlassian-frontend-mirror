import isEqual from 'lodash/isEqual';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { StepMap } from '@atlaskit/editor-prosemirror/transform';

import type { AgentEditChromeRange } from './agent-edit-chrome';

// localId is identity metadata: regenerating it alone should not create activity.
const sameAttrs = (left: PMNode['attrs'], right: PMNode['attrs']): boolean => {
	const keys = Object.keys(left).filter((key) => key !== 'localId');
	return (
		keys.length === Object.keys(right).filter((key) => key !== 'localId').length &&
		keys.every((key) => isEqual(left[key], right[key]))
	);
};

// Compare the node's own type, attributes and marks, without comparing its children.
const sameMarkup = (left: PMNode, right: PMNode): boolean =>
	left.type === right.type &&
	sameAttrs(left.attrs, right.attrs) &&
	left.marks.length === right.marks.length &&
	left.marks.every(
		(mark, index) =>
			mark.type === right.marks[index].type && sameAttrs(mark.attrs, right.marks[index].attrs),
	);

const sameNode = (left: PMNode, right: PMNode): boolean => {
	if (left === right) {
		return true;
	}
	if (
		!sameMarkup(left, right) ||
		left.text !== right.text ||
		left.childCount !== right.childCount
	) {
		return false;
	}
	for (let index = 0; index < left.childCount; index++) {
		if (!sameNode(left.child(index), right.child(index))) {
			return false;
		}
	}
	return true;
};

// Positions include document structure, not just character offsets. A non-leaf node
// uses one position for each opening/closing boundary, plus the size of its content.
// Example: paragraph('Hi') at pos 0 has nodeSize 4, outer range [0, 4),
// and text content [1, 3). All ranges here use an exclusive end position.
type PositionedNode = { node: PMNode; pos: number };
type PreservedNodeIndexes = WeakMap<PMNode, Map<string, PositionedNode | null>>;
// Keep the reason internally so a panel attribute change can survive child edits.
// Only ordinary { from, to } ranges are returned to the chrome consumer.
type ChangedRange = AgentEditChromeRange & { markupChanged: boolean };

const collectChanges = (
	before: PositionedNode | undefined,
	after: PositionedNode,
	map: StepMap,
	ranges: ChangedRange[],
): void => {
	const { node, pos } = after;
	if (before && sameNode(before.node, node)) {
		return;
	}
	// Text edits belong to their textblock. A node's own markup change instead
	// owns its full content, so we stop here rather than adding child ranges too.
	const markupChanged = !!before && node.isBlock && !sameMarkup(before.node, node);
	if (node.isTextblock || markupChanged) {
		if (node.content.size > 0) {
			ranges.push({ from: pos, to: pos + node.nodeSize, markupChanged });
		}
		return;
	}

	const byPosition = new Map<number, PositionedNode>();
	const byId = new Map<string, PositionedNode | null>();
	const oldChildren: PositionedNode[] = [];
	before?.node.forEach((child, offset) => {
		// forEach offsets start inside the parent. Skip its opening boundary (+1)
		// to convert this child offset into an absolute document position.
		const previous = { node: child, pos: before.pos + 1 + offset };
		oldChildren.push(previous);
		// This 1 is a mapping bias, not an added offset: follow the right side
		// of an insertion at the child's start, keeping the original child after it.
		const mapped = map.mapResult(previous.pos, 1);
		if (!mapped.deleted) {
			byPosition.set(mapped.pos, previous);
		}
		const id = child.attrs.localId;
		if (typeof id === 'string' && id) {
			// Duplicate IDs cannot identify a unique old child.
			byId.set(id, byId.has(id) ? null : previous);
		}
	});
	const nextChildren: PositionedNode[] = [];
	node.forEach((child, offset) => nextChildren.push({ node: child, pos: pos + 1 + offset }));
	// Narrow edits usually preserve mapped positions. Whole-container replacements
	// may erase those positions, so stable child IDs provide a second way to match.
	const preferred = nextChildren.map(
		(next) => byPosition.get(next.pos) ?? byId.get(next.node.attrs.localId) ?? undefined,
	);
	const claims = new Map<PositionedNode, number>();
	for (const match of preferred) {
		if (match) {
			claims.set(match, (claims.get(match) ?? 0) + 1);
		}
	}
	nextChildren.forEach((next, index) => {
		const match = preferred[index];
		// Same-index fallback supports replacements that regenerate IDs but keep
		// the child structure. Different child counts make that correspondence unsafe.
		const aligned = oldChildren.length === node.childCount ? oldChildren[index] : undefined;
		// Reserve every position/ID match before fallback, including later siblings.
		// Reusing one old sibling can otherwise disguise an equal-text insertion.
		const previous =
			match && claims.get(match) === 1
				? match
				: aligned && !claims.has(aligned)
					? aligned
					: undefined;
		collectChanges(previous, next, map, ranges);
	});
};

const findPreservedNode = (
	doc: PMNode,
	previous: PMNode,
	markupChanged: boolean,
	indexes: PreservedNodeIndexes,
): PositionedNode | undefined => {
	const id = previous.attrs.localId;
	if (typeof id !== 'string' || !id) {
		return;
	}
	let byId = indexes.get(doc);
	if (!byId) {
		// Build only when mapping loses a candidate, then reuse for every range
		// visiting this immutable snapshot. Ordinary mapped edits need no scan.
		const nodeIndex = new Map<string, PositionedNode | null>();
		doc.descendants((node, pos) => {
			const localId = node.attrs.localId;
			if (typeof localId === 'string' && localId) {
				// Keep duplicates ambiguous, including IDs outside the changed subtree.
				nodeIndex.set(localId, nodeIndex.has(localId) ? null : { node, pos });
			}
		});
		indexes.set(doc, nodeIndex);
		byId = nodeIndex;
	}
	const match = byId.get(id);
	// Attribute/mark activity belongs to the node even when its children are edited.
	// Content-only activity still requires the entire candidate to survive unchanged.
	const isPreserved = markupChanged ? sameMarkup : sameNode;
	return match && isPreserved(previous, match.node) ? match : undefined;
};

const mapToFinalBlocks = (
	tr: Transaction,
	index: number,
	range: ChangedRange,
	indexes: PreservedNodeIndexes,
): AgentEditChromeRange[] => {
	let { from, to } = range;
	// Track inner content separately from outer node bounds: +1 skips the opening
	// boundary and -1 excludes the closing boundary (see paragraph example above).
	let contentFrom = from + 1;
	let contentTo = to - 1;
	// docs[i] is the document BEFORE step i, so docs[i + 1] is its result.
	// The last step has no next snapshot; tr.doc is its result instead.
	let node = (tr.docs[index + 1] ?? tr.doc).nodeAt(from);
	if (!node) {
		return [];
	}
	// Later non-AI steps also shift/delete existing activity, even though they
	// cannot create new activity themselves. Process every intermediate document.
	for (let next = index + 1; next < tr.steps.length; next++) {
		const map = tr.mapping.maps[next];
		const after = tr.docs[next + 1] ?? tr.doc;
		// Mapping biases +1 (right) and -1 (left) keep boundary insertions outside
		// the tracked content. These arguments do not add/subtract document positions.
		const start = map.mapResult(contentFrom, 1);
		const end = map.mapResult(contentTo, -1);
		if ((start.deleted && end.deleted) || end.pos <= start.pos) {
			// A cumulative replacement can preserve the candidate content or owned markup.
			// Check every intermediate doc so deletion then reinsertion never resurrects it.
			const preserved = findPreservedNode(after, node, range.markupChanged, indexes);
			if (!preserved) {
				return [];
			}
			from = preserved.pos;
			to = from + preserved.node.nodeSize;
			contentFrom = from + 1;
			contentTo = to - 1;
			node = preserved.node;
		} else {
			// Apply the same inward biases to the outer node bounds.
			from = map.map(from, 1);
			to = map.map(to, -1);
			contentFrom = start.pos;
			contentTo = end.pos;
			const current = after.nodeAt(from);
			if (current && current.nodeSize === to - from) {
				node = current;
			}
		}
	}
	if (from < 0 || to > tr.doc.content.size || contentTo <= contentFrom) {
		return [];
	}
	const finalNode = tr.doc.nodeAt(from);
	if (finalNode?.isBlock && finalNode.nodeSize === to - from) {
		return [{ from, to }];
	}
	// Joins/splits can leave mapped boundaries inside the final textblock.
	const blocks: AgentEditChromeRange[] = [];
	tr.doc.nodesBetween(contentFrom, contentTo, (child, pos) => {
		if (child.isTextblock) {
			blocks.push({ from: pos, to: pos + child.nodeSize });
			return false;
		}
	});
	return blocks;
};

/**
 * Returns whole content-block ranges for selected applied steps, in tr.doc coordinates.
 * Callers select actual AI writes (excluding restores, acknowledgments and preparation)
 * and own experiment/lifecycle decisions. This helper does not dispatch or render.
 *
 * Comparing each step's snapshots also handles attribute/mark steps with empty maps.
 * Shared unchanged subtrees are skipped by reference. Only localId changes are ignored;
 * meaningful attributes and marks retain the affected node's full content scope.
 */
export function getAgentEditChangedRanges(
	tr: Transaction,
	includedStepIndexes: readonly number[],
): AgentEditChromeRange[] {
	// Positions belong to each intermediate document, not just tr.doc. Keep the
	// lazy indexes local to this call so deletion/reinsertion checks stay intact
	// and no cache is retained between transactions or streaming chunks.
	const indexes: PreservedNodeIndexes = new WeakMap();
	const ranges: AgentEditChromeRange[] = [];
	for (const index of new Set(includedStepIndexes)) {
		if (!Number.isInteger(index) || index < 0 || index >= tr.steps.length) {
			continue;
		}
		const changed: ChangedRange[] = [];
		// The root document has no opening boundary. Using -1 makes the recursive
		// parent.pos + 1 + offset formula place its first child at position 0.
		collectChanges(
			{ node: tr.docs[index], pos: -1 },
			{ node: tr.docs[index + 1] ?? tr.doc, pos: -1 },
			tr.steps[index].getMap(),
			changed,
		);
		for (const range of changed) {
			ranges.push(...mapToFinalBlocks(tr, index, range, indexes));
		}
	}

	// Return only the surviving final-document ranges, never intermediate step states.
	// Sort outer ranges before their children, then discard duplicates/contained ranges.
	// Separate ranges stay separate; this must not highlight the untouched gaps.
	const unique: AgentEditChromeRange[] = [];
	for (const range of ranges.sort((left, right) => left.from - right.from || right.to - left.to)) {
		const previous = unique[unique.length - 1];
		if (!previous || range.to > previous.to) {
			unique.push(range);
		}
	}
	return unique;
}
