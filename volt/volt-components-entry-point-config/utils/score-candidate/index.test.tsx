import type { DetectedBarrel, SubpathCandidate } from '../../scripts/types';
import { scoreCandidate } from '../score-candidate';

describe('scoreCandidate', () => {
	const symbol: DetectedBarrel['symbols'][number] = {
		exportName: 'Box',
		localName: 'Box',
		kind: 'component',
		sourceFilePath: '/pkg/src/components/box.tsx',
	};

	it('scores kebab name + same source higher than a weak alias', () => {
		const strong: SubpathCandidate = {
			entryPoint: '/box',
			filePath: '/pkg/src/entry-points/box.tsx',
			symbols: new Set(['Box']),
			underlyingSources: new Set(['/pkg/src/components/box.tsx']),
		};
		const weak: SubpathCandidate = {
			entryPoint: '/Box',
			filePath: '/pkg/src/entry-points/box-alias.tsx',
			symbols: new Set(['Box', 'A', 'B', 'C', 'D', 'E', 'F']),
			underlyingSources: new Set(),
		};

		expect(scoreCandidate(symbol, strong)).toBeGreaterThan(scoreCandidate(symbol, weak));
	});
});
