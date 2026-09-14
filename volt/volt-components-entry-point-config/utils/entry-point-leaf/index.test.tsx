import { entryPointLeaf } from '../entry-point-leaf';

describe('entryPointLeaf', () => {
	it('returns the last path segment', () => {
		expect(entryPointLeaf('/compiled/box')).toBe('box');
	});

	it('returns empty string for root-like paths', () => {
		expect(entryPointLeaf('')).toBe('');
		expect(entryPointLeaf('/')).toBe('');
	});
});
