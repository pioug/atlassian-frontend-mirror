import { ffTest } from '@atlassian/feature-flags-test-utils';

import { LabelStackRegistry, resolveLabelStackFromTrie } from './label-stack-registry';

import {
	optimizeLabelStack,
	optimizeLabelStackWithRegistry,
	stringifyLabelStackFully,
	stringifyLabelStackWithoutId,
} from './index';

describe('optimizeLabelStackWithRegistry', () => {
	describe('with registry and v2.0.0', () => {
		it('should register labelStack and return terminal trie node id', () => {
			const registry = new LabelStackRegistry();
			const labelStack = [
				{ name: 'jira-spa', segmentId: 'abc123' },
				{ name: 'nav4.topNav', segmentId: 'def456' },
			];

			const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

			expect(typeof result).toBe('number');
			expect(result).toBe(1);
			expect(resolveLabelStackFromTrie(registry.getLookupTable(), result as number)).toBe(
				'abc123/def456',
			);
		});

		it('should return the same terminal node id for duplicate labelStacks', () => {
			const registry = new LabelStackRegistry();
			const labelStack = [
				{ name: 'jira-spa', segmentId: 'abc123' },
				{ name: 'nav4.topNav', segmentId: 'def456' },
			];

			const result1 = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);
			const result2 = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

			expect(result1).toBe(result2);
			expect(result1).toBe(1);
		});

		it('should assign different terminal node ids for different labelStacks', () => {
			const registry = new LabelStackRegistry();
			const labelStack1 = [{ name: 'jira-spa', segmentId: 'abc123' }];
			const labelStack2 = [{ name: 'jira-spa', segmentId: 'def456' }];

			const result1 = optimizeLabelStackWithRegistry(labelStack1, '2.0.0', registry);
			const result2 = optimizeLabelStackWithRegistry(labelStack2, '2.0.0', registry);

			expect(result1).toBe(0);
			expect(result2).toBe(1);
			expect(resolveLabelStackFromTrie(registry.getLookupTable(), result1 as number)).toBe('abc123');
			expect(resolveLabelStackFromTrie(registry.getLookupTable(), result2 as number)).toBe('def456');
		});

		it('should populate the registry lookup table correctly', () => {
			const registry = new LabelStackRegistry();
			const labelStack1 = [{ name: 'jira-spa', segmentId: 'abc123' }];
			const labelStack2 = [
				{ name: 'jira-spa', segmentId: 'abc123' },
				{ name: 'nav4.topNav', segmentId: 'def456' },
			];

			const result1 = optimizeLabelStackWithRegistry(labelStack1, '2.0.0', registry);
			const result2 = optimizeLabelStackWithRegistry(labelStack2, '2.0.0', registry);

			const table = registry.getLookupTable();
			expect(table).toEqual({
				v: 2,
				n: [
					['abc123', -1],
					['def456', 0],
				],
			});
			expect(resolveLabelStackFromTrie(table, result1 as number)).toBe('abc123');
			expect(resolveLabelStackFromTrie(table, result2 as number)).toBe('abc123/def456');
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

	describe('leading slash trimming', () => {
		const labelStack = [
			{ name: 'network' },
			{ name: '/rest/api/3/myself' },
			{ name: '///gateway/api/jsm/ops/web/<uuid>/v1/alerts' },
		];

		test('trims leading slashes across string and array label stack formats', () => {
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
		});

		test('registers label stacks after trimming leading slashes', () => {
			const registry = new LabelStackRegistry();
			const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

			expect(resolveLabelStackFromTrie(registry.getLookupTable(), result as number)).toBe(
				'network/rest/api/3/myself/gateway/api/jsm/ops/web/<uuid>/v1/alerts',
			);
		});
	});

	describe('platform_ufo_trim_labelstack_trailing_slashes', () => {
		const labelStack = [
			{ name: 'network/' },
			{ name: 'rest/api/3/myself/' },
			{ name: 'gateway/api/jsm/ops/web/<uuid>/v1/alerts///' },
		];

		ffTest(
			'platform_ufo_trim_labelstack_trailing_slashes',
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
					'network//rest/api/3/myself//gateway/api/jsm/ops/web/<uuid>/v1/alerts///',
				);
				expect(stringifyLabelStackWithoutId(labelStack)).toBe(
					'network//rest/api/3/myself//gateway/api/jsm/ops/web/<uuid>/v1/alerts///',
				);
				expect(optimizeLabelStack(labelStack, '2.0.0')).toBe(
					'network//rest/api/3/myself//gateway/api/jsm/ops/web/<uuid>/v1/alerts///',
				);
				expect(optimizeLabelStack(labelStack, '1.0.1')).toEqual([
					{ n: 'network/' },
					{ n: 'rest/api/3/myself/' },
					{ n: 'gateway/api/jsm/ops/web/<uuid>/v1/alerts///' },
				]);
			},
		);

		ffTest(
			'platform_ufo_trim_labelstack_trailing_slashes',
			() => {
				const registry = new LabelStackRegistry();
				const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

				expect(resolveLabelStackFromTrie(registry.getLookupTable(), result as number)).toBe(
					'network/rest/api/3/myself/gateway/api/jsm/ops/web/<uuid>/v1/alerts',
				);
			},
			() => {
				const registry = new LabelStackRegistry();
				const result = optimizeLabelStackWithRegistry(labelStack, '2.0.0', registry);

				expect(resolveLabelStackFromTrie(registry.getLookupTable(), result as number)).toBe(
					'network//rest/api/3/myself//gateway/api/jsm/ops/web/<uuid>/v1/alerts///',
				);
			},
		);
	});

	describe('leading and trailing slash trimming together', () => {
		const labelStack = [
			{ name: '/network/' },
			{ name: '/rest/api/3/myself/' },
			{ name: '///gateway/api/jsm/ops/web/<uuid>/v1/alerts/' },
		];

		ffTest(
			'platform_ufo_trim_labelstack_trailing_slashes',
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
					'network//rest/api/3/myself//gateway/api/jsm/ops/web/<uuid>/v1/alerts/',
				);
				expect(stringifyLabelStackWithoutId(labelStack)).toBe(
					'network//rest/api/3/myself//gateway/api/jsm/ops/web/<uuid>/v1/alerts/',
				);
				expect(optimizeLabelStack(labelStack, '2.0.0')).toBe(
					'network//rest/api/3/myself//gateway/api/jsm/ops/web/<uuid>/v1/alerts/',
				);
				expect(optimizeLabelStack(labelStack, '1.0.1')).toEqual([
					{ n: 'network/' },
					{ n: 'rest/api/3/myself/' },
					{ n: 'gateway/api/jsm/ops/web/<uuid>/v1/alerts/' },
				]);
			},
		);
	});
});
