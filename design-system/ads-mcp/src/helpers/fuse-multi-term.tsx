/**
 * Allocation for multi-query Fuse search: each term alone, plus one spaced combined query.
 *
 * `poolMax = limit * termCount`. From each term we take up to `perTermTake` hits; the rest of the
 * pool is filled from the spaced combined query.
 */
export function computeMultiTermFuseAllocation(
	limit: number,
	termCount: number,
): {
	/**
	 * The amount token by each term, minimum of 1.
	 */
	perTermTake: number;
	/**
	 * Hits to take from the spaced combined query.
	 */
	combinedTake: number;
	/**
	 * The total amount of hits to take, minimum of 1.
	 */
	totalTake: number;
} {
	if (termCount <= 1) return { perTermTake: 1, combinedTake: 0, totalTake: 1 };

	const perTermTake = Math.max(Math.round(limit / termCount), 1);
	const combinedTake = Math.max(limit * termCount - termCount * perTermTake, 1);
	const totalTake = Math.max(perTermTake * termCount + combinedTake, 1);
	return { perTermTake, combinedTake, totalTake };
}

export type FuseHit<T> = {
	item: T;
	/**
	 * Fuse score when `includeScore` is enabled; lower is a better match.
	 */
	score?: number;
};

type ScoredHit<T> = {
	item: T;
	score: number;
	key: string;
};

/**
 * Runs `search` for each term (top `perTermTake`) and for `terms.join(' ')` (top `combinedTake`),
 * merges pools, sorts globally by Fuse score, then returns the first `limit` **distinct** keys
 * (later duplicate keys are skipped).
 *
 * Default `tokenKey` uses `item.name` when present; pass an explicit `tokenKey` for types without
 * `name` (e.g. icons keyed by `componentName`).
 */
export function mergeMultiTermFuseResults<T>({
	searchTerms,
	limit,
	search,
	tokenKey = (item: T) => String((item as { name?: string }).name ?? ''),
	searchTermsJoin = ' ',
}: {
	searchTerms: string[];
	limit: number;
	search: (query: string) => FuseHit<T>[];
	tokenKey?: (item: T) => string;
	/**
	 * Join the search terms when querying with this separator, eg. `color.text` vs. `color text`
	 */
	searchTermsJoin?: ' ' | '.';
}): T[] {
	const n = searchTerms.length;

	if (n === 0) {
		return [];
	}

	if (n === 1) {
		return takeFirstUniqueKeys(
			sortByScoreAsc(toScoredHits(search(searchTerms[0]), tokenKey)),
			limit,
		);
	}

	const { perTermTake, combinedTake, totalTake } = computeMultiTermFuseAllocation(limit, n);
	const termsCombined = searchTerms.join(searchTermsJoin);

	const pool: ScoredHit<T>[] = [];
	for (const term of searchTerms) {
		pool.push(...topRankedFromQuery(search, term, tokenKey, perTermTake));
	}

	// Combine the terms together and search as well.
	pool.push(...topRankedFromQuery(search, termsCombined, tokenKey, combinedTake));

	// Grab the top combinations of all queries' results.
	return takeFirstUniqueKeys(sortByScoreAsc(pool), totalTake);
}

/**
 * Best `take` hits for one Fuse query (ranked by score, then slice).
 */
function topRankedFromQuery<T>(
	search: (query: string) => FuseHit<T>[],
	query: string,
	tokenKey: (item: T) => string,
	take: number,
): ScoredHit<T>[] {
	return sortByScoreAsc(toScoredHits(search(query), tokenKey)).slice(0, take);
}

function toScoredHits<T>(fuseHits: FuseHit<T>[], tokenKey: (item: T) => string): ScoredHit<T>[] {
	return fuseHits.map((hit) => ({
		item: hit.item,
		score: hit.score ?? Number.POSITIVE_INFINITY,
		key: tokenKey(hit.item),
	}));
}

function sortByScoreAsc<T>(hits: ScoredHit<T>[]): ScoredHit<T>[] {
	return [...hits].sort((a, b) => a.score - b.score);
}

function takeFirstUniqueKeys<T>(sortedHits: ScoredHit<T>[], limit: number): T[] {
	const seen = new Set<string>();
	const out: T[] = [];
	for (const h of sortedHits) {
		if (seen.has(h.key)) {
			continue;
		}
		seen.add(h.key);
		out.push(h.item);
		if (out.length >= limit) {
			break;
		}
	}
	return out;
}
