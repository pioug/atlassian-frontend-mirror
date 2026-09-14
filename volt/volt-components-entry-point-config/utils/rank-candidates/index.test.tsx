import type { DetectedBarrel, SubpathCandidate } from '../../scripts/types';
import { rankCandidates } from '../rank-candidates';

describe('rankCandidates', () => {
	it('orders candidates by descending score', () => {
		const symbol: DetectedBarrel['symbols'][number] = {
			exportName: 'Box',
			localName: 'Box',
			kind: 'component',
			sourceFilePath: '/pkg/src/box.tsx',
		};
		const low: SubpathCandidate = {
			entryPoint: '/misc',
			filePath: '/pkg/src/misc.tsx',
			symbols: new Set(['Box', 'A', 'B', 'C', 'D', 'E', 'F']),
			underlyingSources: new Set(),
		};
		const high: SubpathCandidate = {
			entryPoint: '/box',
			filePath: '/pkg/src/entry-points/box.tsx',
			symbols: new Set(['Box']),
			underlyingSources: new Set(['/pkg/src/box.tsx']),
		};

		const ranked = rankCandidates(symbol, [low, high]);
		expect(ranked[0].candidate.entryPoint).toBe('/box');
	});
});
