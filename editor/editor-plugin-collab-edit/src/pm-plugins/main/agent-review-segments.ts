import type {
	AgentRemoteEditReviewData,
	AgentRemoteEditReviewSegment,
} from '@atlaskit/editor-common/collab-agent-remote-edit-review';
import { slicesEqualIgnoringLocalId } from '@atlaskit/editor-common/collab-agent-review-slice-compare';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { getCollabState } from '@atlaskit/prosemirror-collab';

import { getAgentEditRequester } from './agent-edit-requester';
import { getMarkStepRange, isPositionNeutralStep } from './agent-shimmer-ranges';

// Statsig dynamic config: which BE-streaming `agentType` values may open Review Moment.
// Code default is `[]` (fail closed) until the list is set in Statsig.
export const REVIEW_MOMENT_AGENT_TYPES_CONFIG = 'platform_editor_backend_review_moment_agent_types';

// [CCI-17994] Post Stream Review ("Review moment") recording for BE streaming.
//
// Sibling to `getAgentShimmerRanges`, but for a different consumer: the shimmer
// only needs the NEW extent of added content, whereas the Review moment needs, per
// contiguous change, BOTH the pre-edit slice (for undo) and the new slice (for
// redo), and must keep deletions. The output is a neutral
// `AgentRemoteEditReviewData`; `editor-plugin-ai` turns each segment into a coarse
// `aiContentPositions` entry and reuses the entire FE Review moment pipeline.
//
// That pipeline requires every coarse entry to be a CLOSED, whole-node slice
// occupying exactly `[startPos, endPos]`. If a slice is left OPEN (a partial node,
// e.g. "…\nD") it drops the node wrapper on reconstruction — losing content on undo
// (data-loss bug) and bleeding highlights into neighbouring nodes. So we expand
// every change to whole-node outer boundaries and only emit self-consistent
// entries (see the group loop below).

const clampToDoc = (doc: PMNode, pos: number): number =>
	Math.min(Math.max(pos, 1), doc.content.size);

const topLevelBlockIndexAt = (doc: PMNode, pos: number): number =>
	doc.resolve(clampToDoc(doc, pos)).index(0);

// Outer boundaries (before/after tokens) of the top-level node containing `pos`.
// Slicing between these includes each node's own wrapper tokens, so the slice is
// CLOSED (`openStart === openEnd === 0`) and preserves node type on reconstruction
// (a `heading` stays a heading). `depth === 0` means `pos` sits between top-level
// nodes, so it is already a node boundary.
// Whether `pos` sits INSIDE a top-level node (depth > 0) vs exactly on a node
// boundary (depth 0). Unlike `clampToDoc`, this clamps to `[0, size]` (allowing 0)
// so the doc-start boundary is correctly reported as a boundary, not forced into
// the first node. Used to tell a structural add/remove (zero-width span at a node
// boundary) from a text-only insert/delete inside a surviving node.
const isInsideNode = (doc: PMNode, pos: number): boolean =>
	doc.resolve(Math.min(Math.max(pos, 0), doc.content.size)).depth > 0;

const topLevelNodeStart = (doc: PMNode, pos: number): number => {
	const $pos = doc.resolve(clampToDoc(doc, pos));
	return $pos.depth === 0 ? $pos.pos : $pos.before(1);
};
const topLevelNodeEnd = (doc: PMNode, pos: number): number => {
	const $pos = doc.resolve(clampToDoc(doc, pos));
	return $pos.depth === 0 ? $pos.pos : $pos.after(1);
};

// Map a position in doc_{i+1} forward through the remaining steps to final-doc
// coords. Mirrors the shimmer's `mapToFinalDoc` — a later step's own inserted
// content starts at its `from`; only subsequent steps shift it.
const mapToFinalDoc = (steps: Step[], pos: number, stepIndex: number, bias: number): number => {
	let p = pos;
	for (let j = stepIndex + 1; j < steps.length; j++) {
		p = steps[j].getMap().map(p, bias);
	}
	return p;
};

// Map a step's `old` coord (valid in doc_i, this step's input) back to pre-batch
// (`tr.before`) coords by inverting the PRECEDING steps' maps in reverse. Needed to
// recover a deletion's original span: its new extent is zero-width, so it cannot be
// found by inverse-mapping the collapsed new point.
const mapToBeforeDoc = (steps: Step[], pos: number, stepIndex: number, bias: number): number => {
	let p = pos;
	for (let j = stepIndex - 1; j >= 0; j--) {
		p = steps[j].getMap().invert().map(p, bias);
	}
	return p;
};

/**
 * A change region tracked in BOTH coordinate spaces: `[from, to]` in the final doc
 * (`tr.doc`) and `[origFrom, origTo]` in the pre-batch doc (`tr.before`). Carrying
 * the original span explicitly lets a deletion (zero-width final extent) still
 * recover its removed content.
 */
interface Range {
	from: number;
	origFrom: number;
	origTo: number;
	to: number;
}

/**
 * Derive per-change Review moment segments from an agent-authored remote-step
 * batch. Returns `null` when there is nothing to record (no agent steps, agentType
 * not allowlisted, a rebase invalidated our index math, or derivation threw) so the
 * caller can no-op safely — this must never throw into the shared remote-step
 * handler.
 *
 * @param json  the raw received step JSON (carries `agentType` / `agentId` / `userId`)
 * @param steps the parsed PM steps (index-aligned with `json`)
 * @param tr    the transaction that applied `steps` (so `tr.before`/`tr.doc`/`tr.mapping` are available)
 * @param view  the editor view (for the collab rebase guard)
 */
export const getAgentEditSegments = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json: any[],
	steps: Step[],
	tr: Transaction,
	view: EditorView,
): AgentRemoteEditReviewData | null => {
	const agentEditRequester = getAgentEditRequester(json, view);
	if (!agentEditRequester) {
		return null;
	}
	const { actorUserId, agentId, agentType, isLocalUserRequester } = agentEditRequester;

	// Only record Review Moment for agentTypes allowlisted in Statsig. Default `[]` fails
	// closed until the config is populated (CCI-18607).
	const allowedAgentTypes = expVal<string[]>(REVIEW_MOMENT_AGENT_TYPES_CONFIG, 'value', []);
	if (!allowedAgentTypes.includes(agentType)) {
		return null;
	}
	// Hybrid end-of-edit seam: if the BE/NCS flags a batch as the terminal one, carry
	// it so the AI plugin can open review immediately instead of waiting for the
	// debounce. Additive marker; absent for streaming (non-final) batches.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const complete = json.some((step: any) => step?.agentEditComplete === true);

	// Same rebase guard as the shimmer: index-based range math is only valid if any
	// rebased-over local steps shifted no positions. Degrade to no recording otherwise.
	if (Number(tr.getMeta('rebased')) > 0) {
		const unconfirmed = getCollabState(view.state)?.unconfirmed ?? [];
		if (unconfirmed.some((entry) => !isPositionNeutralStep(entry.step))) {
			return null;
		}
	}

	try {
		// Each agent step's changed extent in FINAL-doc coords, taken from its StepMap
		// (the canonical, step-type-agnostic source). Unlike the shimmer we KEEP
		// zero-width new extents — a pure deletion has `newEnd === newStart` but is a
		// reviewable `remove`.
		const ranges: Range[] = [];
		json.forEach((rawStep, index) => {
			if (typeof rawStep?.agentType !== 'string') {
				return;
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const pmStep = steps[index] as any;
			if (typeof pmStep?.getMap !== 'function') {
				return;
			}
			// Mark-only steps have an empty StepMap, so the getMap().forEach below never fires for them.
			// Derive their range from step.from/.to so a formatting-only agent edit still becomes a segment.
			const markRange = getMarkStepRange(steps[index]);
			if (markRange) {
				const mappedFrom = mapToFinalDoc(steps, markRange.from, index, -1);
				const mappedTo = mapToFinalDoc(steps, markRange.to, index, 1);
				const mappedOrigFrom = mapToBeforeDoc(steps, markRange.from, index, -1);
				const mappedOrigTo = mapToBeforeDoc(steps, markRange.to, index, 1);
				if (mappedTo > mappedFrom) {
					try {
						const before = tr.before.slice(mappedOrigFrom, mappedOrigTo);
						const after = tr.doc.slice(mappedFrom, mappedTo);
						if (!before.content.eq(after.content)) {
							ranges.push({
								from: mappedFrom,
								to: mappedTo,
								origFrom: mappedOrigFrom,
								origTo: mappedOrigTo,
							});
						}
					} catch (error) {
						// Degrade gracefully (skip this step's range) but track the error so a silent
						// fall-through does not hide a systemic slicing problem.
						logException(error as Error, {
							location: 'editor-plugin-collab-edit/agent-review-segments/markStepSlice',
						});
					}
				}
				return;
			}
			pmStep
				.getMap()
				.forEach((oldStart: number, oldEnd: number, newStart: number, newEnd: number) => {
					const mappedFrom = mapToFinalDoc(steps, newStart, index, -1);
					const mappedTo = mapToFinalDoc(steps, newEnd, index, 1);
					// The same change in pre-batch coords, so a deletion (zero-width new
					// extent) still carries its original span.
					const mappedOrigFrom = mapToBeforeDoc(steps, oldStart, index, -1);
					const mappedOrigTo = mapToBeforeDoc(steps, oldEnd, index, 1);
					// Skip position-neutral phantom touches: the collab apply stamps same-size
					// re-writes on unrelated nodes (e.g. `localId` on panels). Drop them only
					// when byte-identical, so a real same-size replacement is preserved.
					if (oldEnd - oldStart === newEnd - newStart) {
						try {
							const before = tr.before.slice(oldStart, oldEnd);
							const after = tr.doc.slice(mappedFrom, mappedTo);
							if (before.content.eq(after.content)) {
								return;
							}
						} catch {
							// Comparison unsafe: keep the range; whole-block expansion + the
							// later identical-content skip still guard against phantoms.
						}
					}
					ranges.push({
						from: mappedFrom,
						to: mappedTo,
						origFrom: mappedOrigFrom,
						origTo: mappedOrigTo,
					});
				});
		});

		if (!ranges.length) {
			return null;
		}

		// Coalesce fragments in the same/adjacent top-level block into one region (a
		// single agent edit arrives as many small replace fragments); an untouched block
		// between them splits the run so far-apart edits stay separate. Each region
		// becomes one coarse segment; the AI plugin refines it further.
		const sorted = [...ranges].sort((a, b) => a.from - b.from || a.to - b.to);
		const groups: Array<{
			from: number;
			maxBlock: number;
			origFrom: number;
			origTo: number;
			to: number;
		}> = [];
		sorted.forEach((range) => {
			const block = topLevelBlockIndexAt(tr.doc, range.from);
			const current = groups[groups.length - 1];
			// Coalesce changes in the same or directly-adjacent top-level block (index n /
			// n+1) into one region, exactly like the shimmer — a single agent edit arrives
			// as many small fragments. A genuinely untouched block in between (index gap
			// > 1) splits the run, keeping far-apart edits separate. The original span is
			// unioned in parallel so a deletion's removed content is preserved.
			if (current && block <= current.maxBlock + 1) {
				current.to = Math.max(current.to, range.to);
				current.maxBlock = Math.max(current.maxBlock, block);
				current.origFrom = Math.min(current.origFrom, range.origFrom);
				current.origTo = Math.max(current.origTo, range.origTo);
			} else {
				groups.push({
					from: range.from,
					to: range.to,
					maxBlock: block,
					origFrom: range.origFrom,
					origTo: range.origTo,
				});
			}
		});

		const segments: AgentRemoteEditReviewSegment[] = [];
		groups.forEach((group) => {
			try {
				// Expand the NEW extent to whole-node outer boundaries → a CLOSED slice.
				// A zero-width new extent at a top-level node boundary is a structural
				// deletion: leave it empty (do NOT whole-node expand, or it would grab the
				// unchanged neighbour node that now sits at that point and be discarded as an
				// identical phantom). A zero-width new extent INSIDE a node is a text-only
				// deletion from a surviving node, so expand to the whole node (an `update`).
				const newIsStructuralRemove = group.from === group.to && !isInsideNode(tr.doc, group.from);
				const newFrom = topLevelNodeStart(tr.doc, Math.min(group.from, group.to));
				const newTo = newIsStructuralRemove
					? newFrom
					: topLevelNodeEnd(tr.doc, Math.max(group.from, group.to));
				const newSlice = tr.doc.slice(newFrom, newTo);

				// Build the ORIGINAL slice from the carried pre-batch span, expanded to whole
				// nodes → a CLOSED slice. Using the carried `origFrom/origTo` (from the
				// StepMap `old` coords) rather than inverse-mapping the new bounds is what
				// lets a deletion recover its removed content.
				//
				// A zero-width original span is only a true structural ADD when it sits at a
				// top-level node boundary (inserting a whole new node). A zero-width span
				// INSIDE a node is a text insertion into that node, so expand to the whole
				// node (an `update`) — matching how an in-place edit reviews.
				const origIsStructuralAdd =
					group.origFrom === group.origTo && !isInsideNode(tr.before, group.origFrom);
				const origFrom = topLevelNodeStart(tr.before, Math.min(group.origFrom, group.origTo));
				const origTo = origIsStructuralAdd
					? origFrom
					: topLevelNodeEnd(tr.before, Math.max(group.origFrom, group.origTo));
				const originalSlice = tr.before.slice(origFrom, origTo);

				const originalEmpty = originalSlice.content.size === 0;
				const newEmpty = newSlice.content.size === 0;
				// A truly empty-to-empty region is not a change — skip it.
				if (originalEmpty && newEmpty) {
					return;
				}
				// Skip phantom artifacts: a same-size StepMap "touch" at an unrelated node
				// (e.g. a `localId` stamp on a panel during collab apply) expands to a
				// segment whose original and new content are identical — not a real change.
				// Layout-only marks (`breakout`) and `localId`s are ignored so a
				// breakout-width-only change is not recorded as a coarse segment: the FE
				// Review filter drops it anyway, so recording it here would anchor the modal
				// to a node with no visible diff.
				if (slicesEqualIgnoringLocalId(originalSlice, newSlice)) {
					return;
				}
				const kind: AgentRemoteEditReviewSegment['kind'] = originalEmpty
					? 'add'
					: newEmpty
						? 'remove'
						: 'update';

				segments.push({
					startPos: newFrom,
					endPos: newTo,
					originalSlice,
					newSlice,
					kind,
				});
			} catch {
				// One bad group must not drop the others.
			}
		});

		if (!segments.length) {
			return null;
		}

		return { actorUserId, agentId, agentType, complete, isLocalUserRequester, segments };
	} catch {
		// Never throw into the shared remote-step handler; degrade to no recording.
		return null;
	}
};
