export function sortByRank(a: { rank: number }, b: { rank: number }): number {
	return a.rank - b.rank;
}
