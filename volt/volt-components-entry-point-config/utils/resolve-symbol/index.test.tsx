import type { DetectedBarrel, SubpathCandidate } from '../../scripts/types';
import { resolveSymbol } from '../resolve-symbol';

describe('resolveSymbol', () => {
	it('returns a single winner when scores are unique', () => {
		const symbol: DetectedBarrel['symbols'][number] = {
			exportName: 'Box',
			localName: 'Box',
			kind: 'component',
			sourceFilePath: '/pkg/src/box.tsx',
		};
		const candidates: SubpathCandidate[] = [
			{
				entryPoint: '/box',
				filePath: '/pkg/src/entry-points/box.tsx',
				symbols: new Set(['Box']),
				underlyingSources: new Set(['/pkg/src/box.tsx']),
			},
			{
				entryPoint: '/misc',
				filePath: '/pkg/src/misc.tsx',
				symbols: new Set(['Box']),
				underlyingSources: new Set(),
			},
		];

		expect(resolveSymbol(symbol, candidates).entryPoint).toBe('/box');
	});

	it('returns null entry-point when top scores tie', () => {
		const symbol: DetectedBarrel['symbols'][number] = {
			exportName: 'Shared',
			localName: 'Shared',
			kind: 'type',
			sourceFilePath: null,
		};
		const candidates: SubpathCandidate[] = [
			{
				entryPoint: '/a',
				filePath: '/pkg/a.tsx',
				symbols: new Set(['Shared']),
				underlyingSources: new Set(),
			},
			{
				entryPoint: '/b',
				filePath: '/pkg/b.tsx',
				symbols: new Set(['Shared']),
				underlyingSources: new Set(),
			},
		];

		const result = resolveSymbol(symbol, candidates);
		expect(result.entryPoint).toBeNull();
		expect(result.candidates).toEqual(['/a', '/b']);
	});
});
