import isEqual from 'lodash/isEqual';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { StepMap } from '@atlaskit/editor-prosemirror/transform';

import type { AgentEditChromeRange } from './agent-edit-chrome';

export type AgentEditRangeTransaction = Pick<
	Transaction,
	'before' | 'doc' | 'docs' | 'steps' | 'mapping'
>;

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
type IndexedNode = PositionedNode & { index: number; parent?: IndexedNode };
type SnapshotIndex = {
	byId: Map<string, IndexedNode | null>;
	byPosition: Map<number, IndexedNode>;
	nodes: IndexedNode[];
	textblocks: IndexedNode[];
};
type SnapshotIndexes = WeakMap<PMNode, SnapshotIndex>;
type AlignedNodeOffsets = WeakMap<PMNode, number[]>;
type RangeMappingOptions = {
	alignedOffsets?: AlignedNodeOffsets;
	requireUniqueSourceIds: boolean;
};
// Keep the reason internally so a panel attribute change can survive child edits.
// Only ordinary { from, to } ranges are returned to the chrome consumer.
type ChangedRange = AgentEditChromeRange & { markupChanged: boolean };

const getSnapshotIndex = (doc: PMNode, indexes: SnapshotIndexes): SnapshotIndex => {
	const cached = indexes.get(doc);
	if (cached) {
		return cached;
	}
	const snapshot: SnapshotIndex = {
		byId: new Map(),
		byPosition: new Map(),
		nodes: [],
		textblocks: [],
	};
	const parents: IndexedNode[] = [{ node: doc, pos: -1, index: 0 }];
	doc.descendants((node, pos, _parent, index) => {
		// Track ancestry by position because one immutable node can occupy several slots.
		while (
			parents.length > 1 &&
			pos >= parents[parents.length - 1].pos + parents[parents.length - 1].node.nodeSize - 1
		) {
			parents.pop();
		}
		const positioned = { node, pos, parent: parents[parents.length - 1], index };
		snapshot.byPosition.set(pos, positioned);
		snapshot.nodes.push(positioned);
		if (node.isTextblock) {
			snapshot.textblocks.push(positioned);
		}
		const id = node.attrs.localId;
		if (typeof id === 'string' && id) {
			snapshot.byId.set(id, snapshot.byId.has(id) ? null : positioned);
		}
		if (!node.isLeaf) {
			parents.push(positioned);
		}
	});
	indexes.set(doc, snapshot);
	return snapshot;
};

const indexedNodeAt = (doc: PMNode, pos: number, indexes: SnapshotIndexes): PMNode | undefined => {
	const snapshot = getSnapshotIndex(doc, indexes);
	const exact = snapshot.byPosition.get(pos);
	if (exact) {
		return exact.node;
	}
	// nodeAt also returns a text node when the position is inside its text.
	let low = 0;
	let high = snapshot.nodes.length;
	while (low < high) {
		const middle = (low + high) >>> 1;
		if (snapshot.nodes[middle].pos <= pos) {
			low = middle + 1;
		} else {
			high = middle;
		}
	}
	const previous = snapshot.nodes[low - 1];
	return previous?.node.isText && pos < previous.pos + previous.node.nodeSize
		? previous.node
		: undefined;
};

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
	before: PMNode | undefined,
	doc: PMNode,
	previous: PMNode,
	markupChanged: boolean,
	indexes: SnapshotIndexes,
): PositionedNode | undefined => {
	const id = previous.attrs.localId;
	if (typeof id !== 'string' || !id) {
		return;
	}
	// When source uniqueness is required, removing a duplicate must not transfer
	// its activity to the remaining equal-content sibling.
	if (before && !getSnapshotIndex(before, indexes).byId.get(id)) {
		return;
	}
	const match = getSnapshotIndex(doc, indexes).byId.get(id);
	// Attribute/mark activity belongs to the node even when its children are edited.
	// Content-only activity still requires the entire candidate to survive unchanged.
	const isPreserved = markupChanged ? sameMarkup : sameNode;
	return match && isPreserved(previous, match.node) ? match : undefined;
};

const findAlignedTextblock = (
	before: PMNode,
	after: PMNode,
	pos: number,
	offsets: AlignedNodeOffsets,
	indexes: SnapshotIndexes,
): PositionedNode | undefined => {
	let original = getSnapshotIndex(before, indexes).byPosition.get(pos);
	const path: IndexedNode[] = [];
	while (original?.parent) {
		path.push(original);
		original = original.parent;
	}
	let parent = after;
	let parentPos = -1;
	for (const child of path.reverse()) {
		const originalParent = child.parent?.node;
		if (!originalParent) {
			return;
		}
		if (parent.type !== originalParent.type || parent.childCount !== originalParent.childCount) {
			return;
		}
		const index = child.index;
		if (index >= parent.childCount) {
			return;
		}
		let childOffsets = offsets.get(parent);
		if (!childOffsets) {
			const computedOffsets: number[] = [];
			parent.forEach((_child, offset) => computedOffsets.push(offset));
			childOffsets = computedOffsets;
			offsets.set(parent, childOffsets);
		}
		parentPos += 1 + childOffsets[index];
		parent = parent.child(index);
	}
	return parent.isTextblock ? { node: parent, pos: parentPos } : undefined;
};

const mapToFinalBlocks = (
	tr: AgentEditRangeTransaction,
	index: number,
	range: ChangedRange,
	indexes: SnapshotIndexes,
	options: RangeMappingOptions,
): AgentEditChromeRange[] => {
	const { alignedOffsets, requireUniqueSourceIds } = options;
	// Carried ranges can cover every block in a document. Repeated nodeAt calls
	// scan preceding siblings, so reuse one positioned index per snapshot instead.
	const nodeAt = (doc: PMNode, pos: number) =>
		alignedOffsets ? indexedNodeAt(doc, pos, indexes) : doc.nodeAt(pos);
	let { from, to } = range;
	// Track inner content separately from outer node bounds: +1 skips the opening
	// boundary and -1 excludes the closing boundary (see paragraph example above).
	let contentFrom = from + 1;
	let contentTo = to - 1;
	// docs[i] is the document BEFORE step i, so docs[i + 1] is its result.
	// The last step has no next snapshot; tr.doc is its result instead.
	let node = nodeAt(tr.docs[index + 1] ?? tr.doc, from);
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
			let preserved = findPreservedNode(
				requireUniqueSourceIds ? tr.docs[next] : undefined,
				after,
				node,
				range.markupChanged,
				indexes,
			);
			const id = node.attrs.localId;
			const sourceMatch =
				typeof id === 'string' && id ? indexes.get(tr.docs[next])?.byId.get(id) : undefined;
			const idMatch = typeof id === 'string' && id ? indexes.get(after)?.byId.get(id) : undefined;
			if (!preserved && alignedOffsets && sourceMatch !== null && idMatch === undefined) {
				// Inline replacements can keep a block's opening boundary while
				// recreating its content and adding later blocks to the same chunk.
				const mapped = map.mapResult(from, 1);
				const mappedNode = !mapped.deleted ? nodeAt(after, mapped.pos) : undefined;
				if (mappedNode?.isTextblock && sameNode(node, mappedNode)) {
					preserved = { node: mappedNode, pos: mapped.pos };
				} else {
					// Whole-block replacements may recreate unchanged blocks without IDs.
					// Match their slot only while every parent keeps its shape.
					const aligned = findAlignedTextblock(tr.docs[next], after, from, alignedOffsets, indexes);
					if (aligned && sameNode(node, aligned.node)) {
						preserved = aligned;
					}
				}
			}
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
			const current = nodeAt(after, from);
			if (current && current.nodeSize === to - from) {
				node = current;
			}
		}
	}
	if (from < 0 || to > tr.doc.content.size || contentTo <= contentFrom) {
		return [];
	}
	const finalNode = nodeAt(tr.doc, from);
	if (finalNode?.isBlock && finalNode.nodeSize === to - from) {
		return [{ from, to }];
	}
	// Joins/splits can leave mapped boundaries inside the final textblock.
	const blocks: AgentEditChromeRange[] = [];
	if (alignedOffsets) {
		const textblocks = getSnapshotIndex(tr.doc, indexes).textblocks;
		let low = 0;
		let high = textblocks.length;
		while (low < high) {
			const middle = (low + high) >>> 1;
			const candidate = textblocks[middle];
			if (candidate.pos + candidate.node.nodeSize <= contentFrom) {
				low = middle + 1;
			} else {
				high = middle;
			}
		}
		for (let index = low; index < textblocks.length && textblocks[index].pos < contentTo; index++) {
			const { node, pos } = textblocks[index];
			blocks.push({ from: pos, to: pos + node.nodeSize });
		}
		return blocks;
	}
	tr.doc.nodesBetween(contentFrom, contentTo, (child, pos) => {
		if (child.isTextblock) {
			blocks.push({ from: pos, to: pos + child.nodeSize });
			return false;
		}
	});
	return blocks;
};

/**
 * Maps existing textblock activity through each applied step into tr.doc coordinates.
 * Replaced content is dropped unless an unchanged block survives with a unique ID
 * or in the same structural slot. Newly changed blocks belong to the producer.
 */
function mapAgentEditChromeRanges(
	tr: AgentEditRangeTransaction,
	ranges: readonly AgentEditChromeRange[],
): AgentEditChromeRange[] {
	const indexes: SnapshotIndexes = new WeakMap();
	const alignedOffsets: AlignedNodeOffsets = new WeakMap();
	const options = { alignedOffsets, requireUniqueSourceIds: true };
	const validRanges: AgentEditChromeRange[] = [];
	for (const { from, to } of ranges) {
		if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
			continue;
		}
		const start = Math.max(0, Math.min(from, tr.before.content.size));
		const end = Math.max(start, Math.min(to, tr.before.content.size));
		if (start === end) {
			continue;
		}
		validRanges.push({ from: start, to: end });
	}
	if (!validRanges.length) {
		return [];
	}
	validRanges.sort((left, right) => left.from - right.from);
	const blocks: ChangedRange[] = [];
	let rangeIndex = 0;
	for (const { node, pos } of getSnapshotIndex(tr.before, indexes).textblocks) {
		while (rangeIndex < validRanges.length && validRanges[rangeIndex].to <= pos) {
			rangeIndex++;
		}
		if (rangeIndex === validRanges.length) {
			break;
		}
		if (node.content.size && validRanges[rangeIndex].from < pos + node.nodeSize) {
			blocks.push({ from: pos, to: pos + node.nodeSize, markupChanged: false });
		}
	}
	// Index -1 starts from docs[0], before the first step, instead of a step result.
	return blocks.flatMap((range) => mapToFinalBlocks(tr, -1, range, indexes, options));
}

/**
 * Returns whole content-block ranges for selected applied steps, in tr.doc coordinates.
 * Callers select actual AI writes (excluding restores, acknowledgments and preparation)
 * and own experiment/lifecycle decisions. This helper does not dispatch or render.
 *
 * Comparing each step's snapshots also handles attribute/mark steps with empty maps.
 * Shared unchanged subtrees are skipped by reference. Only localId changes are ignored;
 * meaningful attributes and marks retain the affected node's full content scope.
 */
function getAgentEditChangedRanges(
	tr: AgentEditRangeTransaction,
	includedStepIndexes: readonly number[],
	requireUniqueSourceIds: boolean,
): AgentEditChromeRange[] {
	// Positions belong to each intermediate document, not just tr.doc. Keep the
	// lazy indexes local to this call so deletion/reinsertion checks stay intact
	// and no cache is retained between transactions or streaming chunks.
	const indexes: SnapshotIndexes = new WeakMap();
	const options = { requireUniqueSourceIds };
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
			ranges.push(...mapToFinalBlocks(tr, index, range, indexes, options));
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

export const agentEditRangeMapping: {
	getChangedRanges: (
		tr: AgentEditRangeTransaction,
		includedStepIndexes: readonly number[],
		requireUniqueSourceIds: boolean,
	) => AgentEditChromeRange[];
	mapChromeRanges: (
		tr: AgentEditRangeTransaction,
		ranges: readonly AgentEditChromeRange[],
	) => AgentEditChromeRange[];
} = {
	getChangedRanges: getAgentEditChangedRanges,
	mapChromeRanges: mapAgentEditChromeRanges,
};
