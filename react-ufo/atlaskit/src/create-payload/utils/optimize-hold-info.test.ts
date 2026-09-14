import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { InteractionMetrics } from '../../common';
import { LabelStackRegistry } from '../common/utils/label-stack-registry';
import { resolveLabelStackFromTrie } from '../common/utils/resolve-label-stack-from-trie';

import { optimizeHoldInfo } from './optimize-hold-info';

describe('optimizeHoldInfo', () => {
	it('includes the readable preload hold name (gate on) alongside a compressed labelStack reference', () => {
		passGate('platform_ufo_preload_hold_adoption');
		const registry = new LabelStackRegistry();
		const source = 'rrr-resource-CURRENT_USER';
		const holdInfo: InteractionMetrics['holdInfo'] = [
			{ labelStack: [], name: `preload:${source}`, start: 1050.4, end: 1600.6 },
		];

		const result = optimizeHoldInfo(holdInfo, 1000, '2.0.0', registry);

		expect(result).toEqual([
			{ labelStack: 0, name: `preload:${source}`, startTime: 1050, endTime: 1601 },
		]);
		expect(resolveLabelStackFromTrie(registry.getLookupTable(), result[0].labelStack)).toBe(
			`preload:${source}`,
		);
	});

	it('omits the name for preload holds when the gate is off', () => {
		failGate('platform_ufo_preload_hold_adoption');
		const source = 'rrr-resource-CURRENT_USER';
		const holdInfo: InteractionMetrics['holdInfo'] = [
			{ labelStack: [], name: `preload:${source}`, start: 1050, end: 1600 },
		];

		const result = optimizeHoldInfo(holdInfo, 1000, '2.0.0');

		expect(result[0]).not.toHaveProperty('name');
		expect(result[0]).toEqual(expect.objectContaining({ startTime: 1050, endTime: 1600 }));
	});

	it('omits the name for non-preload holds', () => {
		failGate('platform_ufo_preload_hold_adoption');
		const holdInfo: InteractionMetrics['holdInfo'] = [
			{ labelStack: [{ name: 'route' }], name: 'resource-load', start: 1100, end: 1200 },
		];

		const result = optimizeHoldInfo(holdInfo, 1000, '2.0.0');

		expect(result[0]).not.toHaveProperty('name');
		expect(result[0]).toEqual(
			expect.objectContaining({
				labelStack: 'route/resource-load',
				startTime: 1100,
				endTime: 1200,
			}),
		);
	});

	it('drops preload holds that started before the interaction', () => {
		failGate('platform_ufo_preload_hold_adoption');
		const source = 'rrr-resource-FORGE_BACKLOG_MODULE';
		const holdInfo: InteractionMetrics['holdInfo'] = [
			{ labelStack: [], name: `preload:${source}`, start: 15702, end: 16198 },
		];

		expect(optimizeHoldInfo(holdInfo, 15859, '2.0.0')).toEqual([]);
	});

	it('still drops non-preload holds that started before the interaction', () => {
		failGate('platform_ufo_preload_hold_adoption');
		const holdInfo: InteractionMetrics['holdInfo'] = [
			{ labelStack: [{ name: 'route' }], name: 'resource-load', start: 15702, end: 16198 },
		];

		expect(optimizeHoldInfo(holdInfo, 15859, '2.0.0')).toEqual([]);
	});

	it('keeps the preload name when duplicate hold timings are merged (gate on)', () => {
		passGate('platform_ufo_preload_hold_adoption');
		const source = 'rrr-resource-CURRENT_USER';
		const holdInfo: InteractionMetrics['holdInfo'] = [
			{ labelStack: [], name: `preload:${source}`, start: 1100, end: 1200 },
			{ labelStack: [], name: `preload:${source}`, start: 1050, end: 1300 },
		];

		expect(optimizeHoldInfo(holdInfo, 1000, '2.0.0')).toEqual([
			{
				labelStack: `preload:${source}`,
				name: `preload:${source}`,
				startTime: 1050,
				endTime: 1300,
			},
		]);
	});
});
