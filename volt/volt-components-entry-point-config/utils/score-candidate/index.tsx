import type { DetectedBarrel, SubpathCandidate } from '../../scripts/types';
import { entryPointDepth } from '../entry-point-depth';
import { entryPointLeaf } from '../entry-point-leaf';
import { isKebabCasePath } from '../is-kebab-case-path';
import { toKebabCase } from '../to-kebab-case';

export function scoreCandidate(
	symbol: DetectedBarrel['symbols'][number],
	candidate: SubpathCandidate,
): number {
	let score = 0;

	if (isKebabCasePath(candidate.entryPoint)) {
		score += 10;
	}

	const leaf = entryPointLeaf(candidate.entryPoint);
	const expectedLeaf = toKebabCase(symbol.exportName === 'default' ? '' : symbol.exportName);
	if (expectedLeaf && leaf === expectedLeaf) {
		score += 50;
	}

	if (symbol.sourceFilePath && candidate.underlyingSources.has(symbol.sourceFilePath)) {
		score += 40;
	}

	const symbolCount = candidate.symbols.size;
	if (symbolCount === 1) {
		score += 20;
	} else if (symbolCount === 2) {
		score += 10;
	} else if (symbolCount > 5) {
		score -= 15;
	}

	score += Math.min(entryPointDepth(candidate.entryPoint), 3) * 3;

	return score;
}
