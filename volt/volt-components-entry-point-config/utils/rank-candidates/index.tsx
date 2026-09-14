import type { DetectedBarrel, SubpathCandidate } from '../../scripts/types';
import { scoreCandidate } from '../score-candidate';

export function rankCandidates(
	symbol: DetectedBarrel['symbols'][number],
	candidates: SubpathCandidate[],
): Array<{
	candidate: SubpathCandidate;
	score: number;
}> {
	return candidates
		.map((candidate) => ({
			candidate,
			score: scoreCandidate(symbol, candidate),
		}))
		.sort((left, right) => right.score - left.score);
}
