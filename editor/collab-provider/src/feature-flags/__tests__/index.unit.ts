import { getProductSpecificFeatureFlags, getCollabProviderFeatureFlag } from '../index';

describe('Feature flags', () => {
	it('getProductSpecificFeatureFlags', () => {
		const result = getProductSpecificFeatureFlags(
			{
				testFF: true,
			},
			'confluence',
		);
		expect(result).toEqual(['confluence.frontend.collab.provider.testFF']);
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

	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	it('getCollabProviderFeatureFlag with wrong ff set', () => {
		const result = getCollabProviderFeatureFlag('testFF', undefined);
		expect(result).toEqual(false);
	});
});
