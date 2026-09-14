import type { DetectedBarrel, SubpathCandidate, SymbolMatch } from '../../scripts/types';
import { candidateExportsSymbol } from '../candidate-exports-symbol';
import { rankCandidates } from '../rank-candidates';

export function resolveSymbol(
	symbol: DetectedBarrel['symbols'][number],
	candidates: SubpathCandidate[],
): {
	entryPoint: string | null;
	match: SymbolMatch | null;
	candidates: string[];
} {
	const matches = new Map<SubpathCandidate, SymbolMatch>();
	for (const candidate of candidates) {
		const match = candidateExportsSymbol(candidate, symbol);
		if (match) {
			matches.set(candidate, match);
		}
	}

	const matching = Array.from(matches.keys());
	if (matching.length === 0) {
		return { entryPoint: null, match: null, candidates: [] };
	}

	const ranked = rankCandidates(symbol, matching);
	const bestScore = ranked[0]?.score ?? -1;
	const top = ranked.filter((item) => item.score === bestScore);

	if (top.length === 1) {
		const winner = top[0].candidate;
		return {
			entryPoint: winner.entryPoint,
			match: matches.get(winner) ?? null,
			candidates: matching.map((candidate) => candidate.entryPoint),
		};
	}

	return {
		entryPoint: null,
		match: null,
		candidates: top.map((item) => item.candidate.entryPoint),
	};
}
