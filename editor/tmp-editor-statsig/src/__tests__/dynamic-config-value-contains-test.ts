import FeatureGates from '@atlaskit/feature-gate-js-client';

import { dynamicConfigStringListIncludes } from '../dynamic-config-value-contains';

describe('dynamicConfigStringListIncludes', () => {
	const initializeCompleted = jest.spyOn(FeatureGates, 'initializeCompleted');
	const getExperiment = jest.spyOn(FeatureGates, 'getExperiment');

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns false when FeatureGates is not initialized', () => {
		initializeCompleted.mockReturnValue(false);

		expect(dynamicConfigStringListIncludes('some-config', 'token')).toBe(false);
		expect(getExperiment).not.toHaveBeenCalled();
	});

	it('returns true when config.value.value string list includes the token', () => {
		initializeCompleted.mockReturnValue(true);
		getExperiment.mockReturnValue({
			value: { value: ['remove-rovo-placeholder', 'other'] },
		} as unknown as ReturnType<typeof FeatureGates.getExperiment>);

		expect(
			dynamicConfigStringListIncludes(
				'platform_editor_ai_autocomplete_ux_config',
				'remove-rovo-placeholder',
			),
		).toBe(true);
	});

	it('returns false when the token is not in the list', () => {
		initializeCompleted.mockReturnValue(true);
		getExperiment.mockReturnValue({
			value: { value: ['other'] },
		} as unknown as ReturnType<typeof FeatureGates.getExperiment>);

		expect(
			dynamicConfigStringListIncludes(
				'platform_editor_ai_autocomplete_ux_config',
				'remove-rovo-placeholder',
			),
		).toBe(false);
	});

	it('does not match partial substrings (exact list membership only)', () => {
		initializeCompleted.mockReturnValue(true);
		getExperiment.mockReturnValue({
			value: { value: ['remove-rovo'] },
		} as unknown as ReturnType<typeof FeatureGates.getExperiment>);

		expect(
			dynamicConfigStringListIncludes(
				'platform_editor_ai_autocomplete_ux_config',
				'remove-rovo-placeholder',
			),
		).toBe(false);
	});

	it('returns false when `value` is missing or not a string list', () => {
		initializeCompleted.mockReturnValue(true);
		getExperiment.mockReturnValue({
			value: { ux: ['remove-rovo-placeholder'] },
		} as unknown as ReturnType<typeof FeatureGates.getExperiment>);

		expect(dynamicConfigStringListIncludes('cfg', 'remove-rovo-placeholder')).toBe(false);
	});

	it('returns false when getExperiment throws', () => {
		initializeCompleted.mockReturnValue(true);
		getExperiment.mockImplementation(() => {
			throw new Error('unknown config');
		});

		expect(dynamicConfigStringListIncludes('unknown', 'x')).toBe(false);
	});
});
