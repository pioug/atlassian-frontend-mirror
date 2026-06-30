import type { QuickInsertItem } from '../provider-factory';

const SCORE_PROXIMITY_THRESHOLD = 0.2;

/**
 * The extension type for Rovo skills, used to identify skill items in the
 * quick insert menu. Matches the value defined in
 * @atlassian/conversation-assistant-content-transformer/utils/skills.
 *
 * Intentionally duplicated here to avoid adding a runtime dependency from
 * editor-common to the conversation-assistant packages.
 */
const ROVO_SKILL_EXTENSION_TYPE = 'com.atlassian.rovo.skill';

/**
 * Promotes native editor elements above Rovo skill items in search results
 * when their Fuse scores are close.
 *
 * An item is classified as a Rovo skill when its `extensionType` property
 * (set by `buildMenuItem` for all extension manifest items) matches the
 * Rovo skill extension type. Native editor items (Link, Code snippet, Table,
 * etc.) and other non-Rovo extensions are unaffected, regardless of their
 * priority value.
 *
 * When a skill and a native item have similar scores (within the proximity
 * threshold), the native item is promoted above the skill. But when a skill
 * is a significantly better match (e.g. searching "research" and the skill is
 * "Research Insights" while the native item is "Live search"), the skill keeps
 * its higher rank.
 */
export function boostNativeResultsAboveSkills<T extends { item: QuickInsertItem; score?: number }>(
	results: T[],
): T[] {
	const isSkill = (r: T) =>
		(r.item as Record<string, unknown>).extensionType === ROVO_SKILL_EXTENSION_TYPE;

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
