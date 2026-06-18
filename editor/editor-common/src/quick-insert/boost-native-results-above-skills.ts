import type { QuickInsertItem } from '../provider-factory';

// Items with priority >= this threshold are treated as extension-provided
// items (e.g. Rovo skills) and demoted below native editor elements.
// Coupled with priority: 9000 set in
// platform/packages/ai-mate/rovo-skills/src/services/insert-menu-provider/extension-manifest.tsx
const SKILL_PRIORITY_THRESHOLD = 1000;
const SCORE_PROXIMITY_THRESHOLD = 0.2;

/**
 * Promotes native editor elements above extension-provided items (e.g. Rovo
 * skills) in search results when their Fuse scores are close.
 *
 * Skills set a high priority value (e.g. 9000) while native items have no
 * priority (undefined / 0). When a skill and a native item have similar scores
 * (within the proximity threshold), the native item is promoted above the
 * skill. But when a skill is a significantly better match (e.g. searching
 * "research" and the skill is "Research Insights" while the native item is
 * "Live search"), the skill keeps its higher rank.
 */
export function boostNativeResultsAboveSkills<T extends { item: QuickInsertItem; score?: number }>(
	results: T[],
): T[] {
	const isSkill = (r: T) => (r.item.priority ?? 0) >= SKILL_PRIORITY_THRESHOLD;

	const reordered = results.slice(0);
	for (let i = 1; i < reordered.length; i++) {
		if (isSkill(reordered[i])) {
			continue;
		}
		// reordered[i] is a native item — check if there are skills
		// ranked above it that have a similar score.
		let insertAt = i;
		while (
			insertAt > 0 &&
			isSkill(reordered[insertAt - 1]) &&
			Math.abs((reordered[insertAt - 1].score ?? 0) - (reordered[i].score ?? 0)) <
				SCORE_PROXIMITY_THRESHOLD
		) {
			insertAt--;
		}
		if (insertAt < i) {
			const [native] = reordered.splice(i, 1);
			reordered.splice(insertAt, 0, native);
		}
	}
	return reordered;
}
