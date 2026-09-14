import type { SubpathCandidate } from '../../scripts/types';

export function filterCandidatesForBarrel(
	candidates: SubpathCandidate[],
	barrelKey: string,
	nestedBarrelPrefixes: string[],
): SubpathCandidate[] {
	if (barrelKey !== '') {
		const prefix = barrelKey.endsWith('/') ? barrelKey : barrelKey + '/';
		return candidates.filter((candidate) => candidate.entryPoint.startsWith(prefix));
	}

	return candidates.filter((candidate) => {
		for (const nested of nestedBarrelPrefixes) {
			const prefix = nested.endsWith('/') ? nested : nested + '/';
			if (candidate.entryPoint === nested || candidate.entryPoint.startsWith(prefix)) {
				return false;
			}
		}
		return true;
	});
}
