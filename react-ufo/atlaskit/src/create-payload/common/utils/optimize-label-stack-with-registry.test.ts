import { ffTest } from '@atlassian/feature-flags-test-utils';

import { LabelStackRegistry } from './label-stack-registry';

import {
	optimizeLabelStack,
	optimizeLabelStackWithRegistry,
	stringifyLabelStackFully,
	stringifyLabelStackWithoutId,
} from './index';

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

	describe('platform_ufo_trim_labelstack_slashes', () => {
		const labelStack = [
			{ name: 'network' },
			{ name: '/rest/api/3/myself' },
			{ name: '///gateway/api/jsm/ops/web/<uuid>/v1/alerts' },
		];

		ffTest(
			'platform_ufo_trim_labelstack_slashes',
			() => {
				expect(stringifyLabelStackFully(labelStack)).toBe(
					'network/rest/api/3/myself/gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				);
				expect(stringifyLabelStackWithoutId(labelStack)).toBe(
					'network/rest/api/3/myself/gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				);
				expect(optimizeLabelStack(labelStack, '2.0.0')).toBe(
					'network/rest/api/3/myself/gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				);
				expect(optimizeLabelStack(labelStack, '1.0.1')).toEqual([
					{ n: 'network' },
					{ n: 'rest/api/3/myself' },
					{ n: 'gateway/api/jsm/ops/web/<uuid>/v1/alerts' },
				]);
			},
			() => {
				expect(stringifyLabelStackFully(labelStack)).toBe(
					'network//rest/api/3/myself////gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				);
				expect(stringifyLabelStackWithoutId(labelStack)).toBe(
					'network//rest/api/3/myself////gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				);
				expect(optimizeLabelStack(labelStack, '2.0.0')).toBe(
					'network//rest/api/3/myself////gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				);
				expect(optimizeLabelStack(labelStack, '1.0.1')).toEqual([
					{ n: 'network' },
					{ n: '/rest/api/3/myself' },
					{ n: '///gateway/api/jsm/ops/web/<uuid>/v1/alerts' },
				]);
			},
		);

		ffTest(
			'platform_ufo_trim_labelstack_slashes',
			() => {
				const registry = new LabelStackRegistry();
				const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

				expect(result).toBe(0);
				expect(registry.getLookupTable()).toEqual({
					'0': 'network/rest/api/3/myself/gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				});
			},
			() => {
				const registry = new LabelStackRegistry();
				const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

				expect(result).toBe(0);
				expect(registry.getLookupTable()).toEqual({
					'0': 'network//rest/api/3/myself////gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				});
			},
		);
	});
});
