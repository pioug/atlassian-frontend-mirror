import { simplifyChanges, ChangeSet, type Change } from 'prosemirror-changeset';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Mark } from '@atlaskit/editor-prosemirror/model';
import { Mapping, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step, StepMap } from '@atlaskit/editor-prosemirror/transform';

import { optimizeChanges } from './optimizeChanges';

const mapPosition = (mapping: Mapping, pos: number): number => mapping.map(pos);

/**
 * Build a per-content-offset view of the textblock's characters.
 *
 * Returns an array `chars` whose length is `parent.content.size`. For every
 * offset that lies inside a text node, `chars[offset]` is the character at
 * that offset; for every offset that lies inside (or on the edge of) a
 * non-text inline node — hardBreak, mention, emoji, date, etc. — the entry
 * is `null`.
 *
 * Using doc positions to index `parent.textContent` is wrong because
 * `textContent` strips non-text inline nodes, so every such node shifts the
 * lookup off by its size. This per-offset view restores a 1:1 mapping between
 * doc positions inside the textblock and the character (or "no character",
 * i.e. a hard word boundary) at that position.
 */
const buildCharsByOffset = (parent: PMNode): Array<string | null> => {
	const chars: Array<string | null> = new Array(parent.content.size).fill(null);
	parent.content.forEach((child, offset) => {
		if (!child.isText) {
			return;
		}
		const text = child.text ?? '';
		for (let i = 0; i < text.length; i++) {
			chars[offset + i] = text[i];
		}
	});
	return chars;
};

/**
 * Given a ProseMirror doc and a position range [from, to], expand
 * both endpoints outward to the nearest word boundaries.
 *
 * A "word character" is any Unicode letter/number or underscore. Punctuation is
 * treated as part of the same token only when it is sandwiched between two
 * non-whitespace characters, so contractions like "You'll", accented words like
 * "l'été", and punctuation-joined tokens like "deep-sea" or "foo/bar" stay
 * intact without treating standalone punctuation as a general word character.
 * Expansion stops at whitespace, standalone punctuation, the boundary of any
 * non-text inline node (hardBreak, mention, emoji, date, etc.), or the
 * textblock edges.
 *
 * If `from` and `to` resolve into different parent nodes, or if the
 * parent is not a textblock, the range is returned unchanged.
 */
const expandToWordBoundaries = (
	doc: PMNode,
	from: number,
	to: number,
): { from: number; to: number } => {
	const $from = doc.resolve(from);

	// Only expand inside a textblock.
	if (!$from.parent.isTextblock) {
		return { from, to };
	}

	// When `from !== to`, verify both ends are in the same textblock.
	if (from !== to) {
		const $to = doc.resolve(to);
		if ($from.parent !== $to.parent) {
			return { from, to };
		}
	}

	const parent = $from.parent;
	const parentStart = $from.start(); // absolute position of the first character in the textblock

	// Per-offset view of the textblock so we don't conflate the inline
	// positions of non-text nodes (hardBreak, mention, emoji, date, etc.)
	// with the characters returned by `parent.textContent`.
	const chars = buildCharsByOffset(parent);

	// Convert absolute doc positions to zero-based content offsets.
	let fromIdx = from - parentStart;
	let toIdx = to - parentStart;

	// Base word chars are Unicode letters/numbers/underscore. Punctuation only
	// counts when it is surrounded by non-whitespace characters, e.g. in
	// "You'll", "deep-sea", or "foo/bar". `null` still behaves like a hard
	// boundary because only string neighbors qualify.
	const isWordCharAt = (idx: number): boolean => {
		if (idx < 0 || idx >= chars.length) {
			return false;
		}

		const ch = chars[idx];
		if (typeof ch !== 'string') {
			return false;
		}
		const prev = chars[idx - 1];
		const next = chars[idx + 1];

		return (
			// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
			/[\p{L}\p{N}_]/u.test(ch) ||
			// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
			(/\p{P}/u.test(ch) &&
				typeof prev === 'string' &&
				typeof next === 'string' &&
				// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
				!/\s/u.test(prev) &&
				// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
				!/\s/u.test(next))
		);
	};

	// Detect whether the position sits mid-word: there is a word character
	// on both sides of the position (or, for a non-empty range, on the
	// outer side of each endpoint).
	const isMidWord = (idx: number) =>
		idx > 0 && idx < chars.length && isWordCharAt(idx - 1) && isWordCharAt(idx);

	// For a zero-width range (pure insertion / deletion point), only expand
	// if the point is mid-word — i.e. both the char before and after are
	// word characters. Otherwise the point is already at a word boundary.
	if (from === to) {
		if (!isMidWord(fromIdx)) {
			return { from, to };
		}
		// Expand both directions from the mid-word point.
		while (fromIdx > 0 && isWordCharAt(fromIdx - 1)) {
			fromIdx--;
		}
		while (toIdx < chars.length && isWordCharAt(toIdx)) {
			toIdx++;
		}
		return { from: parentStart + fromIdx, to: parentStart + toIdx };
	}

	// Non-empty range: expand each endpoint outward if it is mid-word.

	// Expand left only if `from` is truly mid-word: the character at `from`
	// (inside the range) and the character before `from` are both word chars.
	if (fromIdx > 0 && fromIdx < chars.length && isWordCharAt(fromIdx) && isWordCharAt(fromIdx - 1)) {
		while (fromIdx > 0 && isWordCharAt(fromIdx - 1)) {
			fromIdx--;
		}
	}

	// Expand right only if `to` is truly mid-word: the character just before
	// `to` (last char of the range) and the character at `to` are both word chars.
	if (toIdx > 0 && toIdx < chars.length && isWordCharAt(toIdx - 1) && isWordCharAt(toIdx)) {
		while (toIdx < chars.length && isWordCharAt(toIdx)) {
			toIdx++;
		}
	}

	return { from: parentStart + fromIdx, to: parentStart + toIdx };
};

/**
 * Compare marks between two nodes
 * We have to check each child because adding a mark splits text into multiple nodes
 */
const hasSameChildMarks = (left: PMNode, right: PMNode): boolean => {
	if (left.childCount !== right.childCount) {
		return false;
	}

	for (let index = 0; index < left.childCount; index++) {
		if (!Mark.sameSet(left.child(index).marks, right.child(index).marks)) {
			return false;
		}
	}

	return true;
};

const createMapping = (maps: StepMap[]): Mapping => {
	const mapping = new Mapping();
	for (const map of maps) {
		mapping.appendMap(map);
	}
	return mapping;
};

const createSpans = (length: number) =>
	length > 0
		? [
				{
					length,
					data: null,
				},
		  ]
		: [];

const mergeOverlappingByNewDocRange = (changes: Change[]): Change[] => {
	if (changes.length <= 1) {
		return changes;
	}

	const sortedChanges = [...changes].sort((left, right) => left.fromB - right.fromB);
	const merged: Change[] = [];
	let current = { ...sortedChanges[0] };

	for (let i = 1; i < sortedChanges.length; i++) {
		const next = sortedChanges[i];
		const isOverlapping = next.fromB <= current.toB;

		if (isOverlapping) {
			current = {
				fromA: Math.min(current.fromA, next.fromA),
				toA: Math.max(current.toA, next.toA),
				fromB: Math.min(current.fromB, next.fromB),
				toB: Math.max(current.toB, next.toB),
				deleted: [...current.deleted, ...next.deleted],
				inserted: [...current.inserted, ...next.inserted],
			};
		} else {
			merged.push(current);
			current = { ...next };
		}
	}

	merged.push(current);
	return merged;
};

/**
 * This function checks whether to do granular diffing.
 * We should do granular diffing if:
 * - The step is a replace step
 * - The step is not open
 * - The replaced slice is not open
 * - The replaced slice has only one child
 * - The replacing slice has only one child
 * - The replaced slice and replacing slice have the same text content
 * - The replaced slice and replacing slice have the same child marks (if text content is equal)
 */
const shouldCheckGranularDiff = (
	step: Step,
	before: PMNode,
	from: number,
	to: number,
): step is ReplaceStep => {
	if (!(step instanceof ReplaceStep)) {
		return false;
	}
	if (step.slice.openStart !== 0 || step.slice.openEnd !== 0) {
		return false;
	}

	const replacedSlice = before.slice(from, to);
	const replacingSlice = step.slice;

	if (
		replacedSlice.openStart !== 0 ||
		replacedSlice.openEnd !== 0 ||
		replacedSlice.content.childCount !== 1 ||
		replacingSlice.content.childCount !== 1
	) {
		return false;
	}

	const replacedNode = replacedSlice.content.firstChild;
	const replacingNode = replacingSlice.content.firstChild;

	if (replacedNode?.type.name !== replacingNode?.type.name || !replacedNode?.type.isTextblock) {
		return false;
	}

	if (!Mark.sameSet(replacedNode?.marks ?? [], replacingNode?.marks ?? [])) {
		return false;
	}

	const isTextContentEqual = replacedNode?.textContent === replacingNode?.textContent;

	return (
		!isTextContentEqual || (isTextContentEqual && hasSameChildMarks(replacedNode, replacingNode))
	);
};

export const diffBySteps = (originalDoc: PMNode, steps: Step[]): Change[] => {
	const changes: Change[] = [];
	let currentDoc = originalDoc;
	const successfulStepMaps = [];
	const rangedSteps: Array<{
		before: PMNode;
		doc: PMNode;
		from: number;
		mapIndex: number;
		step: Step;
		stepMap: StepMap;
		to: number;
	}> = [];

	for (const step of steps) {
		const before = currentDoc;
		const result = step.apply(currentDoc);
		if (result.failed !== null || !result.doc) {
			continue;
		}

		const stepMap = step.getMap();
		const rangeStep = step as Step & { from?: number; to?: number };
		if (typeof rangeStep.from === 'number' && typeof rangeStep.to === 'number') {
			rangedSteps.push({
				before,
				doc: result.doc,
				from: rangeStep.from,
				to: rangeStep.to,
				mapIndex: successfulStepMaps.length,
				step,
				stepMap,
			});
		}

		successfulStepMaps.push(stepMap);
		currentDoc = result.doc;
	}

	for (const rangedStep of rangedSteps) {
		// Mapping from original -> doc before this step.
		const originalToBeforeStep = createMapping(successfulStepMaps.slice(0, rangedStep.mapIndex));
		const beforeStepToOriginal = originalToBeforeStep.invert();

		const fromA = mapPosition(beforeStepToOriginal, rangedStep.from);
		const toA = mapPosition(beforeStepToOriginal, rangedStep.to);

		// Map the step range into final steppedDoc coordinates.
		const fromAfterStep = rangedStep.stepMap.map(rangedStep.from, -1);
		const toAfterStep = rangedStep.stepMap.map(rangedStep.to, 1);
		const afterStepToFinal = createMapping(successfulStepMaps.slice(rangedStep.mapIndex + 1));

		const fromB = mapPosition(afterStepToFinal, fromAfterStep);
		const toB = mapPosition(afterStepToFinal, toAfterStep);

		if (
			shouldCheckGranularDiff(rangedStep.step, rangedStep.before, rangedStep.from, rangedStep.to)
		) {
			const granularStepChanges = ChangeSet.create(rangedStep.before).addSteps(
				rangedStep.doc,
				[rangedStep.stepMap],
				null,
			);

			// `simplifyChanges` reads text using `Change.fromB`/`toB`, which are
			// positions in the post-step doc (the "B" doc). Passing the pre-step
			// doc (`startDoc`) misreads characters and produces mid-word cuts
			// (e.g. "deep-s|ea") because word-boundary detection runs against the
			// wrong text/positions. Use the post-step doc here.
			const optimizedGranularStepChanges = optimizeChanges(
				simplifyChanges(granularStepChanges.changes, rangedStep.doc),
			);
			for (const granularChange of optimizedGranularStepChanges) {
				// Expand each granular change to the nearest word boundaries in
				// both the pre-step doc (A-side) and the post-step doc (B-side).
				// This ensures that a mid-word edit like "sanitised" → "sanitized"
				// shows as deleting the whole original word and inserting the whole
				// new word, rather than a single-character swap.
				const expandedA = expandToWordBoundaries(
					rangedStep.before,
					granularChange.fromA,
					granularChange.toA,
				);
				const expandedB = expandToWordBoundaries(
					rangedStep.doc,
					granularChange.fromB,
					granularChange.toB,
				);

				// When one side expanded further than the other (e.g. a space
				// was inserted mid-word: "altogether" → "all together"), the
				// less-expanded side must grow to match — otherwise the renderer
				// shows a partial word as plain text next to a deletion/insertion.
				// We compare left and right deltas independently so partial
				// expansion on one side doesn't prevent the other side from
				// being pulled out further.
				const aLeftDelta = granularChange.fromA - expandedA.from;
				const aRightDelta = expandedA.to - granularChange.toA;
				const bLeftDelta = granularChange.fromB - expandedB.from;
				const bRightDelta = expandedB.to - granularChange.toB;

				let finalA = expandedA;
				let finalB = expandedB;

				// If A expanded further on either side, nudge B outward
				// by the excess and re-expand to snap to word boundaries.
				if (aLeftDelta > bLeftDelta || aRightDelta > bRightDelta) {
					const extraLeft = Math.max(0, aLeftDelta - bLeftDelta);
					const extraRight = Math.max(0, aRightDelta - bRightDelta);
					finalB = expandToWordBoundaries(
						rangedStep.doc,
						Math.max(expandedB.from - extraLeft, 0),
						expandedB.to + extraRight,
					);
				}

				// If B expanded further on either side, nudge A outward.
				if (bLeftDelta > aLeftDelta || bRightDelta > aRightDelta) {
					const extraLeft = Math.max(0, bLeftDelta - aLeftDelta);
					const extraRight = Math.max(0, bRightDelta - aRightDelta);
					finalA = expandToWordBoundaries(
						rangedStep.before,
						Math.max(expandedA.from - extraLeft, 0),
						expandedA.to + extraRight,
					);
				}

				const granularFromA = mapPosition(beforeStepToOriginal, finalA.from);
				const granularToA = mapPosition(beforeStepToOriginal, finalA.to);
				const granularFromB = mapPosition(afterStepToFinal, finalB.from);
				const granularToB = mapPosition(afterStepToFinal, finalB.to);

				changes.push({
					fromA: granularFromA,
					toA: granularToA,
					fromB: granularFromB,
					toB: granularToB,
					deleted: createSpans(Math.max(0, granularToA - granularFromA)),
					inserted: createSpans(Math.max(0, granularToB - granularFromB)),
				});
			}
			continue;
		}

		changes.push({
			fromA,
			toA,
			fromB,
			toB,
			deleted: createSpans(Math.max(0, toA - fromA)),
			inserted: createSpans(Math.max(0, toB - fromB)),
		});
	}

	return mergeOverlappingByNewDocRange(changes);
};
