import type { MenuItemMatchResult } from '@atlaskit/editor-ui-control-model/types';

/** Keeps score and priority handling consistent across Quick Insert search models. */
export const normalizeQuickInsertMatchResult = (
	match: MenuItemMatchResult | null | undefined,
): MenuItemMatchResult => ({
	priorityGroup: Number.isFinite(match?.priorityGroup) ? match?.priorityGroup : undefined,
	score: Math.min(1, Math.max(0, match?.score ?? 0)),
});
