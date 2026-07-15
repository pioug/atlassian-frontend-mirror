import type { Change } from 'prosemirror-changeset';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { makePromotedChange, mergeOverlappingByNewDocRange, rangesOverlap } from './helpers';
import { buildCharsByOffset, countWords, segmentSentences, segmentWordSpans } from './segmentText';
import { resolveThresholds, type SmartDiffThresholds } from './thresholds';

export type ClassifySmartChangesArgs = {
	changes: Change[];
	locale: string;
	newDoc: PMNode;
	originalDoc: PMNode;
	thresholds?: Partial<SmartDiffThresholds>;
};

/**
 * Block-first `smart` classifier.
 *
 * Groups changes by the top-level block they touch — like the `block` diff type — then
 * classifies WITHIN each block group:
 *
 *   1. structural / node-type change (blockA.type !== blockB.type)  → whole block
 *   2. text-bearing block (paragraph/heading)                       → sentence / paragraph / inline
 *   3. container block (list/table/layout/panel/...)                → recurse into children,
 *      promoting the whole container when changed-child density ≥ node.ratio (with the
 *      rigid-child escalation: cell → row → table, column → section, item → list).
 *
 * Grouping on real top-level block boundaries prevents the "empty structural shell" family
 * of bugs (e.g. bulletList → table rendering empty bullets).
 */
export const classifySmartChanges = ({
	changes,
	originalDoc,
	newDoc,
	locale,
	thresholds: overrides,
}: ClassifySmartChangesArgs): Change[] => {
	if (changes.length === 0) {
		return changes;
	}
	const thresholds = resolveThresholds(overrides);

	const groups = groupByTopLevelBlock(changes, originalDoc, newDoc);

	const result: Change[] = [];
	for (const group of groups) {
		result.push(...classifyBlockGroup(group, originalDoc, newDoc, locale, thresholds));
	}

	// Clamp to valid bounds (defensive) and coalesce overlaps.
	const maxA = originalDoc.content.size;
	const maxB = newDoc.content.size;
	const clamped = result
		.map((change) => clampChange(change, maxA, maxB))
		.filter((change): change is Change => change !== null);
	return mergeOverlappingByNewDocRange(clamped);
};

/**
 * A group of raw changes that all fall within the same top-level block, plus the resolved
 * block node on each side. `blockA`/`blockB` are null for pure insertions/deletions where
 * one side has no corresponding block.
 */
type BlockGroup = {
	/**
	 * Zero-width A-side anchor for a pure insertion (blockA === null). Without this, a pure
	 * insertion would fall back to the raw change's full A range — claiming original content that
	 * a sibling replacement already owns, so the same original block renders as deleted twice.
	 */
	anchorA?: number;
	/** Zero-width B-side anchor for a pure deletion (blockB === null), symmetric to `anchorA`. */
	anchorB?: number;
	/** original-doc block node (null for a pure insertion). */
	blockA: BlockRef | null;
	/** new-doc block node (null for a pure deletion). */
	blockB: BlockRef | null;
	changes: Change[];
};

/** A resolved block: the node plus its OUTER bounds (before open token / after close token). */
type BlockRef = {
	from: number;
	node: PMNode;
	to: number;
};

/**
 * Group changes by the top-level block (direct child of doc) they touch, aligning the A-side
 * and B-side blocks a change covers. A single change can span MULTIPLE top-level blocks (e.g.
 * a ReplaceStep whose slice contains several nodes); we enumerate every block it overlaps on
 * both sides (`topLevelBlocksInRange`) and create one group per aligned block, so added/removed
 * blocks in a multi-node replacement are never dropped. Unlike `groupChangesByBlock`, we KEEP
 * each group's constituent raw changes so intra-block density can be measured.
 */
const groupByTopLevelBlock = (changes: Change[], docA: PMNode, docB: PMNode): BlockGroup[] => {
	const groups = new Map<string, BlockGroup>();

	const ensureGroup = (
		blockA: BlockRef | null,
		blockB: BlockRef | null,
		anchors?: { anchorA?: number; anchorB?: number },
	): BlockGroup | null => {
		if (!blockA && !blockB) {
			return null;
		}
		// Key by both sides so an added block (blockA=null) on the B side and a deleted block
		// (blockB=null) on the A side each get their own group.
		const key = `${blockB ? blockB.from : 'x'}:${blockA ? blockA.from : 'x'}`;
		let group = groups.get(key);
		if (!group) {
			group = { blockA, blockB, changes: [], ...anchors };
			groups.set(key, group);
		}
		return group;
	};

	for (const change of changes) {
		// A single change (e.g. a ReplaceStep whose slice spans several nodes) can cover MULTIPLE
		// top-level blocks on either side. Resolving only the block at `fromB` would silently drop
		// the extra blocks (e.g. an added table after a replaced paragraph). So we enumerate every
		// top-level block the change overlaps on BOTH sides and create a group per aligned block.
		const blocksB = topLevelBlocksInRange(docB, change.fromB, change.toB);
		const blocksA = topLevelBlocksInRange(docA, change.fromA, change.toA);

		// Simple, common case: exactly one block on each side (or one side empty).
		if (blocksB.length <= 1 && blocksA.length <= 1) {
			const group = ensureGroup(blocksA[0] ?? null, blocksB[0] ?? null);
			group?.changes.push(change);
			continue;
		}

		// Multi-block span: align blocks positionally by index. The first `min(len)` blocks are
		// REPLACEMENTS (paired A↔B). Extra B-blocks are PURE INSERTIONS and extra A-blocks are
		// PURE DELETIONS — and, crucially, these must NOT reuse the raw change's full A/B range
		// (that range covers the paired blocks too, so an added block would claim the original
		// content already owned by a paired replacement, rendering it deleted twice). Instead we
		// anchor a pure insertion's A side (and a pure deletion's B side) as ZERO-WIDTH at the
		// end of the last paired block on the opposite side.
		const paired = Math.min(blocksA.length, blocksB.length);
		for (let i = 0; i < paired; i++) {
			const group = ensureGroup(blocksA[i], blocksB[i]);
			group?.changes.push(change);
		}
		// Anchor for extras = end of the last paired block on the opposite side (or the start of
		// the span if there were no paired blocks).
		const anchorA = paired > 0 ? blocksA[paired - 1].to : change.fromA;
		const anchorB = paired > 0 ? blocksB[paired - 1].to : change.fromB;
		for (let i = paired; i < blocksB.length; i++) {
			const group = ensureGroup(null, blocksB[i], { anchorA });
			group?.changes.push(change);
		}
		for (let i = paired; i < blocksA.length; i++) {
			const group = ensureGroup(blocksA[i], null, { anchorB });
			group?.changes.push(change);
		}
	}

	return Array.from(groups.values()).sort(
		(a, b) => (a.blockB?.from ?? a.blockA?.from ?? 0) - (b.blockB?.from ?? b.blockA?.from ?? 0),
	);
};

/**
 * Enumerate the top-level blocks (direct children of doc) whose outer range overlaps
 * `[from, to)`. Returns each as a BlockRef. Used to split a change that spans several blocks.
 */
const topLevelBlocksInRange = (doc: PMNode, from: number, to: number): BlockRef[] => {
	const lo = Math.min(Math.max(from, 0), doc.content.size);
	const hi = Math.min(Math.max(to, lo), doc.content.size);
	const refs: BlockRef[] = [];
	let offset = 0;
	for (let i = 0; i < doc.childCount; i++) {
		const node = doc.child(i);
		const blockFrom = offset;
		const blockTo = offset + node.nodeSize;
		// Non-empty range: standard half-open overlap test.
		if (lo < hi) {
			if (blockFrom < hi && blockTo > lo) {
				refs.push({ node, from: blockFrom, to: blockTo });
			}
		} else if (blockFrom < lo && lo < blockTo) {
			// Zero-width range (an insertion anchor): only match a block whose INTERIOR strictly
			// contains the point. A point sitting exactly on a top-level block boundary
			// (`blockFrom === lo`, i.e. between two sibling blocks) is a pure insertion BETWEEN
			// blocks — it must resolve to NO block, otherwise `groupByTopLevelBlock` pairs the
			// insertion with the following block and `classifyBlockGroup` converts the insert into a
			// whole-block replacement, fabricating a phantom deletion of that untouched block.
			// Interior points (a nested insertion inside a container being edited) still resolve
			// their container so the classifier can recurse into it.
			refs.push({ node, from: blockFrom, to: blockTo });
		}
		offset = blockTo;
	}
	return refs;
};

const clampChange = (change: Change, maxA: number, maxB: number): Change | null => {
	const fromA = Math.max(0, Math.min(change.fromA, maxA));
	const toA = Math.max(fromA, Math.min(change.toA, maxA));
	const fromB = Math.max(0, Math.min(change.fromB, maxB));
	const toB = Math.max(fromB, Math.min(change.toB, maxB));
	if (toA === fromA && toB === fromB) {
		return null;
	}
	return { ...change, fromA, toA, fromB, toB };
};

const TEXT_BLOCK_TYPES = new Set<string>(['paragraph', 'heading']);

/**
 * Rigid children cannot be individually deleted+re-inserted without breaking their parent's
 * structure — promoting one escalates to its structural unit (see classifyContainer):
 *   layoutColumn → layoutSection, tableCell/tableHeader → tableRow → table.
 */
const RIGID_CHILD_TYPES = new Set<string>(['layoutColumn', 'tableCell', 'tableHeader']);
const TABLE_TYPE = 'table';

/**
 * Emit a single whole-block (node-level) change covering both sides of a group. Used for
 * structural / node-type replacements and for containers dense enough to replace wholesale.
 */
const wholeBlockChange = (
	blockA: BlockRef | null,
	blockB: BlockRef | null,
	changes: Change[],
	anchors?: { anchorA?: number; anchorB?: number },
): Change => {
	// Pure insertion (blockA === null): the A side must be a ZERO-WIDTH anchor, never the raw
	// change's A range (which spans sibling blocks that were separately replaced). Same for a
	// pure deletion's B side. Falling back to the change coords is the last-resort path when no
	// anchor was supplied (single-block insert/delete, where the coords are already zero-width).
	const fromA = blockA ? blockA.from : (anchors?.anchorA ?? changes[0].fromA);
	const toA = blockA ? blockA.to : (anchors?.anchorA ?? changes[changes.length - 1].toA);
	const fromB = blockB ? blockB.from : (anchors?.anchorB ?? changes[0].fromB);
	const toB = blockB ? blockB.to : (anchors?.anchorB ?? changes[changes.length - 1].toB);
	return makePromotedChange(fromA, toA, fromB, toB, 'node');
};

/**
 * Classify one block group. This is the single recursive decision point:
 *  - one side missing (pure insert/delete)   → whole block
 *  - node type changed (para→panel, list→table, heading→para, …) → whole block
 *  - text-bearing block                       → sentence / paragraph / inline
 *  - container                                → recurse into children (with rigid escalation)
 */
const classifyBlockGroup = (
	group: BlockGroup,
	originalDoc: PMNode,
	newDoc: PMNode,
	locale: string,
	thresholds: SmartDiffThresholds,
): Change[] => {
	const { blockA, blockB, changes, anchorA, anchorB } = group;

	// Pure insertion or deletion of a whole block.
	if (!blockA || !blockB) {
		return [wholeBlockChange(blockA, blockB, changes, { anchorA, anchorB })];
	}

	// Node-type / structural change: the whole block was replaced. No further analysis — this
	// is what makes list→table, paragraph→panel, heading→paragraph "just work".
	if (blockA.node.type.name !== blockB.node.type.name) {
		return [wholeBlockChange(blockA, blockB, changes)];
	}

	// Text-bearing block → sentence / paragraph / inline.
	if (TEXT_BLOCK_TYPES.has(blockB.node.type.name)) {
		return classifyTextblock(blockA, blockB, changes, locale, thresholds);
	}

	// Container block → measure changed-child density, promote whole container or recurse.
	return classifyContainer(blockA, blockB, changes, originalDoc, newDoc, locale, thresholds);
};

/**
 * Sentence- and paragraph-level classification for a single text-bearing block.
 */
const classifyTextblock = (
	blockA: BlockRef,
	blockB: BlockRef,
	changes: Change[],
	locale: string,
	thresholds: SmartDiffThresholds,
): Change[] => {
	const charsB = buildCharsByOffset(blockB.node);
	const sentencesB = segmentSentences(charsB, locale);
	const charsA = buildCharsByOffset(blockA.node);
	const sentencesA = segmentSentences(charsA, locale);

	// Block content starts one position after the block's outer start (open token).
	const contentStartB = blockB.from + 1;

	// Map each change to the sentence indices (new-doc offset space) it overlaps.
	const changedSentenceIdx = new Set<number>();
	const perSentenceChanges = new Map<number, Change[]>();
	for (const change of changes) {
		const fromOff = change.fromB - contentStartB;
		const toOff = change.toB - contentStartB;
		for (let s = 0; s < sentencesB.length; s++) {
			const sentence = sentencesB[s];
			if (rangesOverlap(fromOff, Math.max(toOff, fromOff + 1), sentence.from, sentence.to)) {
				changedSentenceIdx.add(s);
				let list = perSentenceChanges.get(s);
				if (!list) {
					list = [];
					perSentenceChanges.set(s, list);
				}
				list.push(change);
			}
		}
	}

	// Level 2: paragraph promotion.
	const sentenceDenom = Math.max(sentencesA.length, sentencesB.length, 1);
	const sentencesChanged = changedSentenceIdx.size;
	if (
		sentencesChanged >= thresholds.paragraph.minChanged &&
		sentencesChanged / sentenceDenom >= thresholds.paragraph.ratio
	) {
		return [makePromotedChange(blockA.from, blockA.to, blockB.from, blockB.to, 'paragraph')];
	}

	// Level 1: per-sentence promotion (else keep inline changes).
	const contentStartA = blockA.from + 1;
	const out: Change[] = [];
	for (const [sIdx, sentenceChanges] of perSentenceChanges.entries()) {
		const sentence = sentencesB[sIdx];
		const wordsNew = countWords(charsB, sentence, locale);
		const sentA = sentencesA[sIdx];
		const wordsOld = sentA ? countWords(charsA, sentA, locale) : 0;

		const wordSpans = segmentWordSpans(charsB, sentence, locale);
		let wordsChanged = 0;
		for (const w of wordSpans) {
			const overlaps = sentenceChanges.some((c) =>
				rangesOverlap(
					c.fromB - contentStartB,
					Math.max(c.toB - contentStartB, c.fromB - contentStartB + 1),
					w.from,
					w.to,
				),
			);
			if (overlaps) {
				wordsChanged++;
			}
		}

		const wordDenom = Math.max(wordsOld, wordsNew, 1);
		if (
			wordsChanged >= thresholds.sentence.minChanged &&
			wordsChanged / wordDenom >= thresholds.sentence.ratio
		) {
			const fromB = contentStartB + sentence.from;
			const toB = contentStartB + sentence.to;
			const fromA = sentA ? contentStartA + sentA.from : sentenceChanges[0].fromA;
			const toA = sentA ? contentStartA + sentA.to : sentenceChanges[0].toA;
			out.push(makePromotedChange(fromA, toA, fromB, toB, 'sentence'));
		} else {
			out.push(...sentenceChanges);
		}
	}
	return out;
};

/** A resolved direct child of a container, with its outer bounds and index. */
type ChildRef = { from: number; index: number; node: PMNode; to: number };

/** Resolve the direct children of a container node (whose OUTER start is `blockFrom`). */
const childRefs = (block: BlockRef): ChildRef[] => {
	const refs: ChildRef[] = [];
	let offset = block.from + 1; // content starts after the container's open token
	block.node.forEach((child, _, index) => {
		refs.push({ node: child, from: offset, to: offset + child.nodeSize, index });
		offset += child.nodeSize;
	});
	return refs;
};

/** Which direct-child indices of `block` are touched by any of `changes` (new-doc coords). */
const changedChildIndices = (
	block: BlockRef,
	children: ChildRef[],
	changes: Change[],
): Set<number> => {
	const changed = new Set<number>();
	for (const child of children) {
		const touched = changes.some((c) =>
			rangesOverlap(c.fromB, Math.max(c.toB, c.fromB + 1), child.from, child.to),
		);
		if (touched) {
			changed.add(child.index);
		}
	}
	return changed;
};

/**
 * A single entry in an aligned child list: a matched A/B pair, a pure insertion (a=null), or a
 * pure deletion (b=null).
 */
type ChildAlignment = { a: ChildRef | null; b: ChildRef | null };

/**
 * Align a container's A-side and B-side direct children via an LCS over their serialized
 * content. This is essential because index alignment (`childrenA[childB.index]`) breaks the
 * moment a child is inserted or removed: every child after the insertion/deletion point would
 * be mis-paired, causing added items to be classified against the wrong (or a B-side) original
 * child — which corrupts the A-side coordinates and makes one list's deletions surface under a
 * different block. The LCS pairs identical children as "matched" (unchanged, skipped later),
 * leaving genuinely added children as B-only and removed children as A-only.
 */
const alignChildren = (childrenA: ChildRef[], childrenB: ChildRef[]): ChildAlignment[] => {
	const keyA = childrenA.map((c) => JSON.stringify(c.node.toJSON()));
	const keyB = childrenB.map((c) => JSON.stringify(c.node.toJSON()));
	const n = childrenA.length;
	const m = childrenB.length;
	// LCS length table.
	const lcs: number[][] = Array.from({ length: n + 1 }, () =>
		Array.from({ length: m + 1 }, () => 0),
	);
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			lcs[i][j] =
				keyA[i] === keyB[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
		}
	}
	// Backtrack. Identical children become matched anchors. Runs of non-identical children
	// between anchors are "zipped" positionally into modified pairs (a & b), with any leftover
	// B children as pure insertions and leftover A children as pure deletions. Zipping avoids
	// treating a MODIFIED child (whose content merely differs) as a delete+insert — that pairing
	// lets the recursion diff inside the child (inline/sentence) instead of replacing it whole.
	const out: ChildAlignment[] = [];
	let i = 0;
	let j = 0;
	// Pending runs of unmatched children on each side, flushed (zipped) at each anchor / at end.
	let runA: ChildRef[] = [];
	let runB: ChildRef[] = [];
	const flushRuns = (): void => {
		const shared = Math.min(runA.length, runB.length);
		for (let k = 0; k < shared; k++) {
			out.push({ a: runA[k], b: runB[k] });
		}
		for (let k = shared; k < runA.length; k++) {
			out.push({ a: runA[k], b: null });
		}
		for (let k = shared; k < runB.length; k++) {
			out.push({ a: null, b: runB[k] });
		}
		runA = [];
		runB = [];
	};
	while (i < n && j < m) {
		if (keyA[i] === keyB[j]) {
			flushRuns();
			out.push({ a: childrenA[i], b: childrenB[j] });
			i++;
			j++;
		} else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
			runA.push(childrenA[i]);
			i++;
		} else {
			runB.push(childrenB[j]);
			j++;
		}
	}
	while (i < n) {
		runA.push(childrenA[i]);
		i++;
	}
	while (j < m) {
		runB.push(childrenB[j]);
		j++;
	}
	flushRuns();
	return out;
};

/**
 * Container classification with the rigid-child escalation rules:
 *  - list:         replace whole list if changed items / items ≥ node.ratio, else recurse
 *                  into each changed listItem's content.
 *  - table:        replace whole table if changed cells / cells ≥ node.ratio; else, for each
 *                  changed ROW, replace the row if changed cells / row-cells ≥ node.ratio,
 *                  else recurse into each changed cell's content.
 *  - layout:       replace whole section if changed columns / columns ≥ node.ratio, else
 *                  recurse into each changed column's content.
 *  - generic (panel/expand/quote/...): replace whole block if changed children / children ≥
 *                  node.ratio, else recurse into each changed child.
 */
const classifyContainer = (
	blockA: BlockRef,
	blockB: BlockRef,
	changes: Change[],
	originalDoc: PMNode,
	newDoc: PMNode,
	locale: string,
	thresholds: SmartDiffThresholds,
): Change[] => {
	const typeName = blockB.node.type.name;

	// Tables need cell-level counting across rows; handle them specially.
	if (typeName === TABLE_TYPE) {
		return classifyTable(blockA, blockB, changes, originalDoc, newDoc, locale, thresholds);
	}

	const childrenB = childRefs(blockB);
	const childrenA = childRefs(blockA);
	const changed = changedChildIndices(blockB, childrenB, changes);

	const denom = Math.max(childrenA.length, childrenB.length, 1);
	if (changed.size / denom >= thresholds.node.ratio) {
		return [wholeBlockChange(blockA, blockB, changes)];
	}

	// Below threshold → recurse per child, using an LCS alignment so inserted/removed children
	// do not mis-pair (which previously corrupted A-side coordinates and leaked one block's
	// deletions into another). Each alignment entry is one of:
	//   - matched (a & b): recurse to classify any intra-child changes (skipped if identical);
	//   - added (b only):  a pure insertion, with a zero-width A anchor near its position;
	//   - removed (a only): a pure deletion, with a zero-width B anchor near its position.
	const alignment = alignChildren(childrenA, childrenB);
	const out: Change[] = [];
	// Running A/B anchors from the last matched pair, so pure insert/delete get sensible
	// zero-width coordinates on the opposite side.
	let lastMatchedAEnd = blockA.from + 1;
	let lastMatchedBEnd = blockB.from + 1;
	for (const { a, b } of alignment) {
		if (a && b) {
			lastMatchedAEnd = a.to;
			lastMatchedBEnd = b.to;
			// Identical content is left as-is by the LCS; if a change still overlaps this pair
			// (e.g. marks), recurse to classify it.
			const childChanges = changes.filter((c) =>
				rangesOverlap(c.fromB, Math.max(c.toB, c.fromB + 1), b.from, b.to),
			);
			if (childChanges.length === 0) {
				continue;
			}
			out.push(...classifyChild(a, b, childChanges, originalDoc, newDoc, locale, thresholds));
			continue;
		}
		if (b && !a) {
			// Added child: pure insertion. Anchor the (empty) A side at the last matched A end.
			out.push(makePromotedChange(lastMatchedAEnd, lastMatchedAEnd, b.from, b.to, 'node'));
			lastMatchedBEnd = b.to;
			continue;
		}
		if (a && !b) {
			// Removed child: pure deletion. Anchor the (empty) B side at the last matched B end.
			out.push(makePromotedChange(a.from, a.to, lastMatchedBEnd, lastMatchedBEnd, 'node'));
			lastMatchedAEnd = a.to;
		}
	}
	return out;
};

/**
 * Classify a table: replace the whole table when changed-cells/total-cells ≥ node.ratio;
 * otherwise for each changed row, replace the row when its own changed-cells/row-cells ≥
 * node.ratio, else recurse into each changed cell.
 */
const classifyTable = (
	blockA: BlockRef,
	blockB: BlockRef,
	changes: Change[],
	originalDoc: PMNode,
	newDoc: PMNode,
	locale: string,
	thresholds: SmartDiffThresholds,
): Change[] => {
	const rowsB = childRefs(blockB);
	const rowsA = childRefs(blockA);

	// Total cell counts across the whole table.
	let totalCellsB = 0;
	let changedCellsB = 0;
	const perRowChangedCells = new Map<number, Set<number>>();
	for (const row of rowsB) {
		const cells = childRefs(row);
		totalCellsB += cells.length;
		const changedCells = changedChildIndices(row, cells, changes);
		if (changedCells.size > 0) {
			perRowChangedCells.set(row.index, changedCells);
			changedCellsB += changedCells.size;
		}
	}
	let totalCellsA = 0;
	for (const row of rowsA) {
		totalCellsA += row.node.childCount;
	}
	const cellDenom = Math.max(totalCellsA, totalCellsB, 1);

	// Whole-table replacement.
	if (changedCellsB / cellDenom >= thresholds.node.ratio) {
		return [wholeBlockChange(blockA, blockB, changes)];
	}

	const out: Change[] = [];
	// LCS-align rows (mirrors classifyContainer) so an inserted/deleted row does not mis-pair
	// every subsequent row by index (which would corrupt the row-level A coordinates).
	const rowAlignment = alignChildren(rowsA, rowsB);
	let lastMatchedRowAEnd = blockA.from + 1;
	let lastMatchedRowBEnd = blockB.from + 1;
	for (const { a: rowA, b: rowB } of rowAlignment) {
		// Added row: pure insertion (only if it actually carries changes).
		if (rowB && !rowA) {
			if ((perRowChangedCells.get(rowB.index)?.size ?? 0) > 0) {
				out.push(
					makePromotedChange(lastMatchedRowAEnd, lastMatchedRowAEnd, rowB.from, rowB.to, 'node'),
				);
			}
			lastMatchedRowBEnd = rowB.to;
			continue;
		}
		// Removed row: pure deletion.
		if (rowA && !rowB) {
			out.push(
				makePromotedChange(rowA.from, rowA.to, lastMatchedRowBEnd, lastMatchedRowBEnd, 'node'),
			);
			lastMatchedRowAEnd = rowA.to;
			continue;
		}
		if (!rowA || !rowB) {
			continue;
		}
		lastMatchedRowAEnd = rowA.to;
		lastMatchedRowBEnd = rowB.to;
		const changedCells = perRowChangedCells.get(rowB.index);
		if (!changedCells || changedCells.size === 0) {
			continue;
		}
		const cellsB = childRefs(rowB);
		// Row-level replacement.
		if (
			changedCells.size / Math.max(rowA.node.childCount, cellsB.length, 1) >=
			thresholds.node.ratio
		) {
			out.push(makePromotedChange(rowA.from, rowA.to, rowB.from, rowB.to, 'node'));
			continue;
		}
		// Else recurse into each changed cell's content (cell is never replaced alone). Cells are
		// positionally aligned within a matched row (table columns are fixed, so a cell at index i
		// on the B side corresponds to index i on the A side).
		const cellsA = childRefs(rowA);
		for (const cellB of cellsB) {
			if (!changedCells.has(cellB.index)) {
				continue;
			}
			const cellA = cellsA[cellB.index] ?? null;
			const cellChanges = changes.filter((c) =>
				rangesOverlap(c.fromB, Math.max(c.toB, c.fromB + 1), cellB.from, cellB.to),
			);
			out.push(
				...classifyChild(cellA, cellB, cellChanges, originalDoc, newDoc, locale, thresholds),
			);
		}
	}
	return out;
};

/**
 * Recurse into a rigid/structural child (listItem, layoutColumn, tableCell/tableHeader) or a
 * plain child block. Rigid children are containers of blocks: we recurse into THEIR children
 * (paragraphs, nested lists, …) so we never delete+replace the rigid child itself. A plain
 * text-bearing or container child is classified directly.
 */
const classifyChild = (
	childA: ChildRef | null,
	childB: ChildRef,
	changes: Change[],
	originalDoc: PMNode,
	newDoc: PMNode,
	locale: string,
	thresholds: SmartDiffThresholds,
): Change[] => {
	if (changes.length === 0) {
		return [];
	}
	const typeName = childB.node.type.name;
	const asBlock = (ref: ChildRef | null): BlockRef | null =>
		ref ? { node: ref.node, from: ref.from, to: ref.to } : null;

	// Structurally-rigid wrapper (layoutColumn / tableCell / tableHeader): the wrapper itself is
	// NEVER a whole-block result — deleting+re-inserting a single column or cell would break the
	// parent layout/table structure. We only reach here because the parent already decided NOT
	// to promote wholesale, so we bypass `classifyContainer` (which could promote the whole
	// wrapper when it is internally dense) and classify EACH of the wrapper's direct children on
	// its own. This keeps the diff strictly inside the wrapper (inline / sentence / paragraph,
	// or a nested container such as a list inside a table cell).
	if (RIGID_CHILD_TYPES.has(typeName)) {
		const blockB = asBlock(childB);
		if (!blockB) {
			return [];
		}
		const wrapperA = asBlock(childA);
		const childrenB = childRefs(blockB);
		const childrenA = wrapperA ? childRefs(wrapperA) : [];
		const out: Change[] = [];
		// LCS-align inner children (mirrors classifyContainer) so a paragraph inserted/deleted
		// inside the cell/column does not mis-pair every subsequent inner child by index. We never
		// promote the wrapper itself here — we only classify each inner child.
		const alignment = alignChildren(childrenA, childrenB);
		let lastMatchedAEnd = wrapperA ? wrapperA.from + 1 : blockB.from + 1;
		let lastMatchedBEnd = blockB.from + 1;
		for (const { a, b } of alignment) {
			if (a && b) {
				lastMatchedAEnd = a.to;
				lastMatchedBEnd = b.to;
				const innerChanges = changes.filter((c) =>
					rangesOverlap(c.fromB, Math.max(c.toB, c.fromB + 1), b.from, b.to),
				);
				if (innerChanges.length === 0) {
					continue;
				}
				out.push(...classifyChild(a, b, innerChanges, originalDoc, newDoc, locale, thresholds));
				continue;
			}
			if (b && !a) {
				// Added inner child: pure insertion, zero-width A anchor at the last matched A end.
				out.push(makePromotedChange(lastMatchedAEnd, lastMatchedAEnd, b.from, b.to, 'node'));
				lastMatchedBEnd = b.to;
				continue;
			}
			if (a && !b) {
				// Removed inner child: pure deletion, zero-width B anchor at the last matched B end.
				out.push(makePromotedChange(a.from, a.to, lastMatchedBEnd, lastMatchedBEnd, 'node'));
				lastMatchedAEnd = a.to;
			}
		}
		return out;
	}

	// A `listItem` CAN be replaced wholesale (delete + re-insert at the same position does not
	// break the list's structure), so per the spec it uses the normal container rule: promote
	// the whole item when its own content is dense enough, else recurse into its children.
	if (typeName === 'listItem') {
		const blockB = asBlock(childB);
		const blockAItem = asBlock(childA);
		// Pure deletion of the item: emit the whole A-side item as deleted (zero-width B anchor at
		// the item's own B-less position — anchored at the A start for lack of parent context).
		if (!blockB) {
			return blockAItem
				? [
						makePromotedChange(
							blockAItem.from,
							blockAItem.to,
							blockAItem.from,
							blockAItem.from,
							'node',
						),
					]
				: [];
		}
		// Pure insertion of the item: emit the whole B-side item as inserted with a ZERO-WIDTH A
		// anchor. (Using `blockB` as the A side would make the LCS compare the item against itself
		// and drop the insertion.)
		if (!blockAItem) {
			return [makePromotedChange(blockB.from, blockB.from, blockB.from, blockB.to, 'node')];
		}
		return classifyContainer(blockAItem, blockB, changes, originalDoc, newDoc, locale, thresholds);
	}

	// Plain child block: classify as its own group (text or nested container).
	return classifyBlockGroup(
		{ blockA: asBlock(childA), blockB: asBlock(childB), changes },
		originalDoc,
		newDoc,
		locale,
		thresholds,
	);
};
