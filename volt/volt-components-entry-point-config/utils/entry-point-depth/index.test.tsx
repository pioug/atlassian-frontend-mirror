import { entryPointDepth } from '../entry-point-depth';

describe('entryPointDepth', () => {
	it('counts non-empty segments', () => {
		expect(entryPointDepth('/compiled/box')).toBe(2);
		expect(entryPointDepth('/box')).toBe(1);
		expect(entryPointDepth('')).toBe(0);
	});
});
