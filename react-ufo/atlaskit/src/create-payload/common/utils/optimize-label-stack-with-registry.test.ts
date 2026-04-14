import { LabelStackRegistry } from './label-stack-registry';

import { optimizeLabelStack, optimizeLabelStackWithRegistry } from './index';

describe('optimizeLabelStackWithRegistry', () => {
	describe('with registry and v2.0.0', () => {
		it('should register labelStack and return numeric index', () => {
			const registry = new LabelStackRegistry();
			const labelStack = [
				{ name: 'jira-spa', segmentId: 'abc123' },
				{ name: 'nav4.topNav', segmentId: 'def456' },
			];

			const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

			expect(typeof result).toBe('number');
			expect(result).toBe(0);
		});

		it('should return the same index for duplicate labelStacks', () => {
			const registry = new LabelStackRegistry();
			const labelStack = [
				{ name: 'jira-spa', segmentId: 'abc123' },
				{ name: 'nav4.topNav', segmentId: 'def456' },
			];

			const result1 = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);
			const result2 = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

			expect(result1).toBe(result2);
			expect(result1).toBe(0);
		});

		it('should assign different indices for different labelStacks', () => {
			const registry = new LabelStackRegistry();
			const labelStack1 = [{ name: 'jira-spa', segmentId: 'abc123' }];
			const labelStack2 = [{ name: 'jira-spa', segmentId: 'def456' }];

			const result1 = optimizeLabelStackWithRegistry(labelStack1, '2.0.0', registry);
			const result2 = optimizeLabelStackWithRegistry(labelStack2, '2.0.0', registry);

			expect(result1).toBe(0);
			expect(result2).toBe(1);
		});

		it('should populate the registry lookup table correctly', () => {
			const registry = new LabelStackRegistry();
			const labelStack1 = [{ name: 'jira-spa', segmentId: 'abc123' }];
			const labelStack2 = [
				{ name: 'jira-spa', segmentId: 'abc123' },
				{ name: 'nav4.topNav', segmentId: 'def456' },
			];

			optimizeLabelStackWithRegistry(labelStack1, '2.0.0', registry);
			optimizeLabelStackWithRegistry(labelStack2, '2.0.0', registry);

			const table = registry.getLookupTable();
			expect(table).toEqual({
				'0': 'abc123',
				'1': 'abc123/def456',
			});
		});
	});

	describe('without registry', () => {
		it('should fall back to optimizeLabelStack for v2.0.0', () => {
			const labelStack = [{ name: 'jira-spa', segmentId: 'abc123' }];

			const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', undefined);
			const expected = optimizeLabelStack(labelStack, '2.0.0');

			expect(result).toEqual(expected);
		});

		it('should fall back to optimizeLabelStack for v1.0.1', () => {
			const labelStack = [{ name: 'jira-spa', segmentId: 'abc123' }];

			const result = optimizeLabelStackWithRegistry(labelStack, '1.0.1', undefined);
			const expected = optimizeLabelStack(labelStack, '1.0.1');

			expect(result).toEqual(expected);
		});
	});

	describe('with registry but v1.0.1', () => {
		it('should fall back to optimizeLabelStack (not use registry)', () => {
			const registry = new LabelStackRegistry();
			const labelStack = [{ name: 'jira-spa', segmentId: 'abc123' }];

			const result = optimizeLabelStackWithRegistry(labelStack, '1.0.1', registry);
			const expected = optimizeLabelStack(labelStack, '1.0.1');

			expect(result).toEqual(expected);
			// Registry should remain empty since v1.0.1 doesn't use it
			expect(registry.size).toBe(0);
		});
	});
});
