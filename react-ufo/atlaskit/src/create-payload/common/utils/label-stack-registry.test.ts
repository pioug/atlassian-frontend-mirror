import { LabelStackRegistry } from './label-stack-registry';

describe('LabelStackRegistry', () => {
	it('should register a new labelStack and return index 0', () => {
		const registry = new LabelStackRegistry();
		const index = registry.register('segId123/componentName');
		expect(index).toBe(0);
	});

	it('should return the same index for duplicate labelStack strings', () => {
		const registry = new LabelStackRegistry();
		const index1 = registry.register('segId123/componentName');
		const index2 = registry.register('segId123/componentName');
		expect(index1).toBe(0);
		expect(index2).toBe(0);
	});

	it('should assign incrementing indices for different labelStack strings', () => {
		const registry = new LabelStackRegistry();
		const index1 = registry.register('segId123/componentA');
		const index2 = registry.register('segId456/componentB');
		const index3 = registry.register('segId789/componentC');
		expect(index1).toBe(0);
		expect(index2).toBe(1);
		expect(index3).toBe(2);
	});

	it('should return the correct lookup table', () => {
		const registry = new LabelStackRegistry();
		registry.register('segId123/componentA');
		registry.register('segId456/componentB');
		registry.register('segId123/componentA'); // duplicate

		const table = registry.getLookupTable();
		expect(table).toEqual({
			'0': 'segId123/componentA',
			'1': 'segId456/componentB',
		});
	});

	it('should return empty lookup table when no entries registered', () => {
		const registry = new LabelStackRegistry();
		const table = registry.getLookupTable();
		expect(table).toEqual({});
	});

	it('should track the correct size', () => {
		const registry = new LabelStackRegistry();
		expect(registry.size).toBe(0);

		registry.register('segId123/componentA');
		expect(registry.size).toBe(1);

		registry.register('segId456/componentB');
		expect(registry.size).toBe(2);

		// Duplicate should not increase size
		registry.register('segId123/componentA');
		expect(registry.size).toBe(2);
	});

	it('should handle empty strings', () => {
		const registry = new LabelStackRegistry();
		const index = registry.register('');
		expect(index).toBe(0);
		expect(registry.getLookupTable()).toEqual({ '0': '' });
	});
});
