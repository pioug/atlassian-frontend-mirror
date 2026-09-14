import type { Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * ADF mark types ignored when deciding whether agent-edited content changed:
 *
 *   - `breakout` — a layout-width mark (`mode: wide | full-width`) that a
 *     whole-node/whole-doc replace (e.g. `replaceDoc`) can drop, re-add or
 *     re-value without the reviewable *content* changing.
 *
 * Module-private (not exported) so this file has a single public runtime export
 * (Volt strict-mode rule), and so callers cannot diverge from the one comparison
 * definition below.
 */
const IGNORED_MARK_TYPES: ReadonlySet<string> = new Set(['breakout']);

/**
 * Deep-normalise ADF JSON for change comparison so two structures that differ
 * ONLY by ignorable metadata compare equal. Specifically it:
 *
 *   - strips every `localId` (at any nesting): an ephemeral, per-node identity
 *     stamp that lives both as a node attribute (`attrs.localId`) and as a
 *     `fragment` mark attribute. A whole-node/whole-doc replace (e.g.
 *     `replaceDoc`) re-emits content with FRESH localIds, so content that is
 *     otherwise identical legitimately carries different localIds.
 *   - drops ignorable marks (`IGNORED_MARK_TYPES`, e.g. `breakout`) from every
 *     `marks` array, and removes a `marks` key that becomes empty so `marks: []`
 *     and an absent `marks` compare equal.
 *
 * Removing these regardless of nesting handles all carriers without needing to
 * know the schema.
 */
const normaliseForChangeCompare = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		return value.map(normaliseForChangeCompare);
	}
	if (value && typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
			if (key === 'localId') {
				continue;
			}
			if (key === 'marks' && Array.isArray(child)) {
				const kept = child.filter(
					(mark) =>
						!(
							mark &&
							typeof mark === 'object' &&
							IGNORED_MARK_TYPES.has((mark as { type?: unknown }).type as string)
						),
				);
				// Drop an empty `marks` array so `marks: []` == absent `marks`.
				if (kept.length > 0) {
					result[key] = kept.map(normaliseForChangeCompare);
				}
				continue;
			}
			result[key] = normaliseForChangeCompare(child);
		}
		return result;
	}
	return value;
};

/**
 * We cannot use `Slice.eq` here: it delegates to `Node.eq` → `Node.sameMarkup`,
 * which `compareDeep`s ALL attributes and marks — so two paragraphs with
 * identical text but different `localId`s (or a dropped/re-valued `breakout`) are
 * reported as different. That would leak unchanged segments into the review
 * whenever the AI re-stamps localIds or re-flows layout (the `replaceDoc` case).
 * We instead compare the normalised JSON, plus the open depths (`openStart` /
 * `openEnd`) that `Slice.eq` also considers.
 *
 * Shared here in `@atlaskit/editor-common` so the two sides of the Review
 * pipeline agree on what counts as a change: the collab-edit COARSE segment
 * producer (`getAgentEditSegments`) and the AI-plugin FINE filter
 * (`entryHasNoChange`). If they disagreed, an edit whose only delta is a
 * `breakout` change could be recorded as a segment (anchoring the modal) yet
 * dropped by the filter (no diff). A breakout-only difference is not reviewable;
 * both sides consume this to honour that consistently.
 */
export const slicesEqualIgnoringLocalId = (a: Slice, b: Slice): boolean => {
	if (a === b) {
		return true;
	}
	if (a.openStart !== b.openStart || a.openEnd !== b.openEnd) {
		return false;
	}
	// `Fragment.toJSON()` returns `null` for empty content; normalise so two
	// empty slices (whatever their provenance) still compare equal.
	const aContent = normaliseForChangeCompare(a.content.toJSON() ?? null);
	const bContent = normaliseForChangeCompare(b.content.toJSON() ?? null);
	return JSON.stringify(aContent) === JSON.stringify(bContent);
};
