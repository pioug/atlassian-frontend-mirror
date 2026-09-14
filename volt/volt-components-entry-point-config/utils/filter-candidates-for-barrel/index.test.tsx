import type { SubpathCandidate } from '../../scripts/types';
import { filterCandidatesForBarrel } from '../filter-candidates-for-barrel';

function candidate(entryPoint: string): SubpathCandidate {
	return {
		entryPoint,
		filePath: entryPoint,
		symbols: new Set(),
		underlyingSources: new Set(),
	};
}

describe('filterCandidatesForBarrel', () => {
	const candidates = [
		candidate('/box'),
		candidate('/compiled/box'),
		candidate('/compiled/inline'),
		candidate('/responsive/media'),
	];

	it('scopes nested barrels to their prefix', () => {
		const result = filterCandidatesForBarrel(candidates, '/compiled', ['/compiled', '/responsive']);
		expect(result.map((item) => item.entryPoint)).toEqual(['/compiled/box', '/compiled/inline']);
	});

	it('excludes nested barrel trees from the root barrel', () => {
		const result = filterCandidatesForBarrel(candidates, '', ['/compiled', '/responsive']);
		expect(result.map((item) => item.entryPoint)).toEqual(['/box']);
	});
});
