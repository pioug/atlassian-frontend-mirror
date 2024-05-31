import { getProductSpecificFeatureFlags, getCollabProviderFeatureFlag } from '../index';

describe('Feature flags', () => {
	it('getProductSpecificFeatureFlags', () => {
		const result = getProductSpecificFeatureFlags(
			{
				testFF: true,
				blockViewOnly: true,
				reconcileOnRecovery: true,
			},
			'confluence',
		);
		expect(result).toEqual([
			'confluence.frontend.collab.provider.testFF',
			'confluence.frontend.ncs.block-view-only',
			'confluence.frontend.ncs.reconcile-on-recovery',
		]);
	});

	it('getCollabProviderFeatureFlag return true', () => {
		const result = getCollabProviderFeatureFlag('testFF', {
			testFF: true,
		});
		expect(result).toEqual(true);
	});

	it('getCollabProviderFeatureFlag with wrong ff set', () => {
		const result = getCollabProviderFeatureFlag('testFF', { abc: true });
		expect(result).toEqual(false);
	});

	it('getCollabProviderFeatureFlag with wrong ff set', () => {
		const result = getCollabProviderFeatureFlag('testFF', undefined);
		expect(result).toEqual(false);
	});
});
