import { type ProductKeys } from '../../types';
import * as genericFeatureFlagModule from '../../genericFeatureFlag';
import * as productKeys from '../../productKeys';
jest.mock('../../../mediaFeatureFlag-local', () => ({
	getLocalMediaFeatureFlag: jest.fn().mockReturnValue(null),
}));

jest.spyOn(productKeys, 'getProductKeys').mockImplementation(
	() =>
		({
			confluence: {
				'my-first-flag': 'conflu-my-first-flag',
				'my-second-flag': 'conflu-my-second-flag',
				'my-third-flag': 'conflu-my-third-flag',
				'my-fourth-flag': 'conflu-my-fourth-flag',
			},
			jira: {
				'my-first-flag': 'jira-my-first-flag',
				'my-second-flag': 'jira-my-second-flag',
				'my-third-flag': 'jira-my-third-flag',
				'my-fourth-flag': 'jira-my-fourth-flag',
			},
		}) as unknown as ProductKeys,
);

import {
	defaultMediaFeatureFlags,
	getMediaFeatureFlag,
	filterFeatureFlagNames,
	getFeatureFlagKeysAllProducts,
} from '../../mediaFeatureFlags';
import { type MediaFeatureFlags, type RequiredMediaFeatureFlags } from '../../types';

const getGenericFeatureFlagMock = jest
	.spyOn(genericFeatureFlagModule, 'getGenericFeatureFlag')
	.mockImplementation(() => 'some-value');

describe('Media Feature Flags', () => {
	it('calls the internal getter with the right parameters', () => {
		const consumerFlags = { someKey: 'some-consumer-value' };
		const requestedKey = 'someRequestedKey';
		const value = getMediaFeatureFlag(
			requestedKey as keyof MediaFeatureFlags,
			consumerFlags as MediaFeatureFlags,
		);
		expect(value).toBe('some-value');
		expect(getGenericFeatureFlagMock).toBeCalledWith(
			requestedKey,
			defaultMediaFeatureFlags,
			consumerFlags,
		);
	});

	describe('filterFeatureFlagNames', () => {
		it('returns the flag names switched on', () => {
			expect(
				filterFeatureFlagNames({
					'my-first-flag': true,
					'my-second-flag': false,
					'my-third-flag': true,
					'my-fourth-flag': false,
				} as unknown as RequiredMediaFeatureFlags),
			).toEqual(['my-first-flag', 'my-third-flag']);
		});
	});

	describe('getFeatureFlagKeysAllProducts', () => {
		it('returns all the launch darkly flag names', () => {
			expect(getFeatureFlagKeysAllProducts()).toEqual([
				'conflu-my-first-flag',
				'conflu-my-second-flag',
				'conflu-my-third-flag',
				'conflu-my-fourth-flag',
				'jira-my-first-flag',
				'jira-my-second-flag',
				'jira-my-third-flag',
				'jira-my-fourth-flag',
			]);
		});
	});
});
