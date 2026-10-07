export type SnippetMenuRankInput = {
	insertCount?: number;
	isFavorite: boolean;
	// A string literal union, so Confluence and platform `SnippetScope` enums both fit.
	scope: 'GLOBAL' | 'SITE' | 'USER';
	// Milliseconds since 1970.
	updatedAt: number;
};

const MAX_DATE_MS = 8.64e15; // largest valid Date value
const FAVORITE_TIER = -2;
const CURATED_TIER = 1;

export const TEMPLATE_GALLERY_MENU_RANK = 0;

/**
 * Menu rank for a Block template within the Block templates section. Lower ranks appear first.
 * Each rank is its tier plus a fraction in [0, 1), so tiers never overlap.
 *
 * Negative ranks are intentional and valid. This is a `parents[].rank` sort key, not a Fuse score:
 * the registry menu compares ranks by subtraction, and Fuse's 0–1 `score` is a separate value that
 * is compared first when searching, so rank only orders templates with equal scores.
 */
export const getSnippetMenuRank = ({
	insertCount,
	isFavorite,
	scope,
	updatedAt,
}: SnippetMenuRankInput): number => {
	if (isFavorite) {
		// Stays in (-2, -1.5]; more inserts rank first.
		return FAVORITE_TIER + 1 / ((insertCount ?? 0) + 2);
	}
	if (scope !== 'GLOBAL') {
		const time = Number.isFinite(updatedAt) ? Math.max(updatedAt, 1) : 1;
		// USER and SITE templates stay in [-1, 0); newer updates rank first.
		return -time / MAX_DATE_MS;
	}
	return CURATED_TIER;
};
