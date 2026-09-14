import { barrelKeyToExportsKey } from '../barrel-key-to-exports-key';

describe('barrelKeyToExportsKey', () => {
	it('maps empty barrel key to root export', () => {
		expect(barrelKeyToExportsKey('')).toBe('.');
	});

	it('maps slash-prefixed keys to package exports keys', () => {
		expect(barrelKeyToExportsKey('/compiled')).toBe('./compiled');
	});
});
