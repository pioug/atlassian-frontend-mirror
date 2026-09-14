import { exportsKeyToBarrelKey } from '../exports-key-to-barrel-key';

describe('exportsKeyToBarrelKey', () => {
	it('maps root export to empty barrel key', () => {
		expect(exportsKeyToBarrelKey('.')).toBe('');
	});

	it('maps subpath exports to slash-prefixed keys', () => {
		expect(exportsKeyToBarrelKey('./compiled/box')).toBe('/compiled/box');
	});
});
