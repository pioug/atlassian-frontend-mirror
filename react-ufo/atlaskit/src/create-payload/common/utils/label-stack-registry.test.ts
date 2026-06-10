import { LabelStackRegistry, resolveLabelStackFromTrie } from './label-stack-registry';

function expectResolvedLabelStacks(registry: LabelStackRegistry, refs: Record<string, string>) {
	const lookupTable = registry.getLookupTable();

	for (const [ref, labelStack] of Object.entries(refs)) {
		expect(resolveLabelStackFromTrie(lookupTable, Number(ref))).toBe(labelStack);
	}
}

describe('LabelStackRegistry', () => {
	it('should register a new labelStack and return its terminal trie node id', () => {
		const registry = new LabelStackRegistry();
		const index = registry.register('segId123/componentName');

		expect(index).toBe(1);
		expectResolvedLabelStacks(registry, {
			[index]: 'segId123/componentName',
		});
	});

	it('should return the same terminal node id for duplicate labelStack strings', () => {
		const registry = new LabelStackRegistry();
		const index1 = registry.register('segId123/componentName');
		const index2 = registry.register('segId123/componentName');

		expect(index1).toBe(1);
		expect(index2).toBe(1);
		expectResolvedLabelStacks(registry, {
			[index1]: 'segId123/componentName',
		});
	});

	it('should reuse shared trie prefixes for different labelStack strings', () => {
		const registry = new LabelStackRegistry();
		const index1 = registry.register('segId123/componentA');
		const index2 = registry.register('segId123/componentB');
		const index3 = registry.register('segId123/componentB/child');

		expect(index1).toBe(1);
		expect(index2).toBe(2);
		expect(index3).toBe(3);
		expect(registry.getLookupTable()).toEqual({
			v: 2,
			n: [
				{ l: 'segId123', p: -1 },
				{ l: 'componentA', p: 0 },
				{ l: 'componentB', p: 0 },
				{ l: 'child', p: 2 },
			],
		});
		expectResolvedLabelStacks(registry, {
			[index1]: 'segId123/componentA',
			[index2]: 'segId123/componentB',
			[index3]: 'segId123/componentB/child',
		});
	});

	it('should return the correct lookup table for independent roots', () => {
		const registry = new LabelStackRegistry();
		const index1 = registry.register('segId123/componentA');
		const index2 = registry.register('segId456/componentB');
		registry.register('segId123/componentA'); // duplicate

		const table = registry.getLookupTable();
		expect(table).toEqual({
			v: 2,
			n: [
				{ l: 'segId123', p: -1 },
				{ l: 'componentA', p: 0 },
				{ l: 'segId456', p: -1 },
				{ l: 'componentB', p: 2 },
			],
		});
		expectResolvedLabelStacks(registry, {
			[index1]: 'segId123/componentA',
			[index2]: 'segId456/componentB',
		});
	});

	it('should return empty lookup table when no entries registered', () => {
		const registry = new LabelStackRegistry();
		const table = registry.getLookupTable();
		expect(table).toEqual({ v: 2, n: [] });
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
		expect(registry.getLookupTable()).toEqual({ v: 2, n: [{ l: '', p: -1 }] });
		expectResolvedLabelStacks(registry, {
			[index]: '',
		});
	});

	it('should reduce serialized size when labelStacks share prefixes', () => {
		const registry = new LabelStackRegistry();
		const labelStacks = [
			'VbNU47v/9RU9Fv4/FXnmEgg/veCGX2o/in0kthR/HpqVe0V/media-card-file-card',
			'VbNU47v/9RU9Fv4/FXnmEgg/veCGX2o/in0kthR/HpqVe0V',
			'VbNU47v/9RU9Fv4/FXnmEgg/veCGX2o/in0kthR',
			'VbNU47v/9RU9Fv4/FXnmEgg/veCGX2o/jtN6dUy/3n7ByRU',
			'VbNU47v/9RU9Fv4/FXnmEgg/veCGX2o/jtN6dUy',
			'VbNU47v/9RU9Fv4/FXnmEgg/veCGX2o',
			'VbNU47v/9RU9Fv4/FXnmEgg',
			'VbNU47v/9RU9Fv4',
			'VbNU47v',
		];
		const refs = labelStacks.map((labelStack) => registry.register(labelStack));

		refs.forEach((ref, index) => {
			expect(resolveLabelStackFromTrie(registry.getLookupTable(), ref)).toBe(labelStacks[index]);
		});

		const legacyLookupTable = Object.fromEntries(
			labelStacks.map((labelStack, index) => [String(index), labelStack]),
		);

		expect(JSON.stringify(registry.getLookupTable()).length).toBeLessThan(
			JSON.stringify(legacyLookupTable).length,
		);
	});
});
