import { expVal, expValNoExposure } from '../expVal';

import { setupEditorExperiments } from '../setup';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';

jest.mock('@atlaskit/react-ufo/feature-flags-accessed', () => ({
	addFeatureFlagAccessed: jest.fn(),
}));

import { ffTest } from '@atlassian/feature-flags-test-utils';

const mockGetExperimentValue = jest.spyOn(FeatureGates, 'getExperimentValue');
const mockInitializeCompleted = jest.spyOn(FeatureGates, 'initializeCompleted');

jest.mock('../experiments-config', () => {
	return {
		editorExperimentsConfig: {
			'test-boolean': {
				productKeys: {
					confluence: 'confluence_boolean_example',
					jira: 'jira_boolean_example',
				},
				param: 'isEnabled',
				typeGuard: (value: unknown) => typeof value === 'boolean',
				defaultValue: false,
			},
			'test-multivariate': {
				productKeys: {
					confluence: 'confluence_multivariate_example',
				},
				param: 'variation',
				typeGuard: (value: unknown) =>
					['default value', 'not default value'].includes(value as string),
				defaultValue: 'default value' as const,
			},
			// Experiment in the disallow list — has a different jira key so must use experiment name directly
			'test-disallowed': {
				productKeys: {
					confluence: 'confluence_disallowed_example',
					jira: 'jira_disallowed_different_key',
				},
				param: 'isEnabled',
				typeGuard: (value: unknown) => typeof value === 'boolean',
				defaultValue: false,
			},
		},
		// test-boolean and test-multivariate are NOT in the disallow list, so they use product-specific keys.
		// test-disallowed IS in the disallow list because its jira key differs — it uses the experiment name directly.
		disallowsProductKeys: ['test-disallowed'],
	};
});

describe('expVal', () => {
	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expVal returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce(true);

		// @ts-expect-error
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(true);
	});

	test('expVal returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce('not default value');

		// @ts-expect-error
		expect(expVal('test-multivariate', 'variation', 'default value')).toBe('not default value');
	});

	ffTest.on(
		'platform_editor_experiments_use_product_keys',
		'expVal fires exposure using product key when gate is on',
		() => {
			test('expVal fires exposure', () => {
				setupEditorExperiments('confluence');
				mockGetExperimentValue.mockReturnValueOnce(false);

				// @ts-expect-error
				expVal('test-boolean', 'isEnabled', false);

				// Gate on, test-boolean is NOT in disallowsProductKeys → uses the product-specific key
				expect(mockGetExperimentValue).toHaveBeenNthCalledWith(
					1,
					'confluence_boolean_example',
					'isEnabled',
					false,
					{
						fireExperimentExposure: true,
					},
				);
			});
		},
	);

	test('works with group overrides', () => {
		setupEditorExperiments('test', {
			'test-boolean': true,
			'test-multivariate': 'not default value',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// @ts-ignore
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(true);

		// @ts-ignore
		expect(expVal('test-multivariate', 'variation', 'default value')).toBe('not default value');
	});

	test('works with parameter overrides', () => {
		setupEditorExperiments(
			'confluence',
			{},
			{
				'test-boolean': { isEnabled: false },
				'test-multivariate': { variation: 'override value' },
			},
		);

		// @ts-ignore
		expect(expVal('test-boolean', 'isEnabled', true)).toBe(false);

		// @ts-ignore
		expect(expVal('test-multivariate', 'variation', 'default value')).toBe('override value');
	});

	test('automatically sets boolean experiments to true in test mode', () => {
		setupEditorExperiments('test');

		// @ts-ignore
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(true);
	});
});

describe('expValNoExposure', () => {
	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expValNoExposure returns correct value for boolean experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce(true);

		// @ts-expect-error
		expect(expValNoExposure('test-boolean', 'isEnabled', false)).toBe(true);
	});

	test('expValNoExposure returns correct value for multivariate experiment', () => {
		setupEditorExperiments('confluence');
		mockGetExperimentValue.mockReturnValueOnce('not default value');

		// @ts-expect-error
		expect(expValNoExposure('test-multivariate', 'variation', 'default value')).toBe(
			'not default value',
		);
	});

	ffTest.on(
		'platform_editor_experiments_use_product_keys',
		"expValNoExposure doesn't fire exposure but uses product key when gate is on",
		() => {
			test("expValNoExposure doesn't fire exposure", () => {
				setupEditorExperiments('confluence');
				mockGetExperimentValue.mockReturnValueOnce(false);

				// @ts-expect-error
				expValNoExposure('test-boolean', 'isEnabled', false);

				// Gate on, test-boolean is NOT in disallowsProductKeys → uses the product-specific key
				expect(mockGetExperimentValue).toHaveBeenNthCalledWith(
					1,
					'confluence_boolean_example',
					'isEnabled',
					false,
					{
						fireExperimentExposure: false,
					},
				);
			});
		},
	);

	test('works with group overrides', () => {
		setupEditorExperiments('test', {
			'test-boolean': true,
			'test-multivariate': 'not default value',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		// @ts-ignore
		expect(expValNoExposure('test-boolean', 'isEnabled', false)).toBe(true);

		// @ts-ignore
		expect(expValNoExposure('test-multivariate', 'variation', 'default value')).toBe(
			'not default value',
		);
	});

	test('works with parameter overrides', () => {
		setupEditorExperiments(
			'confluence',
			{},
			{
				'test-boolean': { isEnabled: false },
				'test-multivariate': { variation: 'override value' },
			},
		);

		// @ts-ignore
		expect(expValNoExposure('test-boolean', 'isEnabled', true)).toBe(false);

		// @ts-ignore
		expect(expValNoExposure('test-multivariate', 'variation', 'default value')).toBe(
			'override value',
		);
	});

	test('automatically sets boolean experiments to true in test mode', () => {
		setupEditorExperiments('test');

		// @ts-ignore
		expect(expValNoExposure('test-boolean', 'isEnabled', false)).toBe(true);
	});
});

describe('not initialised client', () => {
	beforeEach(() => {
		mockGetExperimentValue.mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expVal returns default value if FeatureGates client not initialised', () => {
		mockInitializeCompleted.mockReturnValueOnce(false);
		setupEditorExperiments('confluence');

		// @ts-expect-error
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(false);
	});
});

describe('expVal error handling', () => {
	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expVal throws an error when experiment config is not defined', () => {
		setupEditorExperiments('confluence');

		expect(() => {
			// @ts-expect-error - deliberately using an invalid experiment name
			expVal('non-existent-experiment', 'isEnabled', false);
		}).toThrow('Editor experiment configuration is not defined non-existent-experiment');
	});

	test('expVal returns default value when product has no key for the experiment', () => {
		setupEditorExperiments('bitbucket');

		// 'test-boolean' only has 'confluence' and 'jira' product keys, not 'bitbucket'
		// @ts-expect-error
		expect(expVal('test-boolean', 'isEnabled', false)).toBe(false);
		expect(mockGetExperimentValue).not.toHaveBeenCalled();
	});

	test('expVal uses experiment name for disallowsProductKeys experiments on jira (not the jira-specific key)', () => {
		setupEditorExperiments('jira');
		mockGetExperimentValue.mockReturnValueOnce(true);

		// @ts-expect-error
		expVal('test-disallowed', 'isEnabled', false);

		// In disallowsProductKeys → uses experiment name, NOT 'jira_disallowed_different_key'
		expect(mockGetExperimentValue).toHaveBeenNthCalledWith(
			1,
			'test-disallowed',
			'isEnabled',
			false,
			{ fireExperimentExposure: true },
		);
	});

	test('expVal uses jira product key for experiments NOT in disallowsProductKeys', () => {
		setupEditorExperiments('jira');
		mockGetExperimentValue.mockReturnValueOnce(true);

		// @ts-expect-error
		expVal('test-boolean', 'isEnabled', false);

		// Not in disallow list → uses jira product-specific key
		expect(mockGetExperimentValue).toHaveBeenNthCalledWith(
			1,
			'jira_boolean_example',
			'isEnabled',
			false,
			{ fireExperimentExposure: true },
		);
	});

	ffTest.off(
		'platform_editor_experiments_use_product_keys',
		'gate is off — always uses experiment name',
		() => {
			test('expVal uses experiment name when gate is off (even for non-disallowed experiments on jira)', () => {
				setupEditorExperiments('jira');
				mockGetExperimentValue.mockReturnValueOnce(true);

				// @ts-expect-error
				expVal('test-boolean', 'isEnabled', false);

				// Gate off → uses experiment name, not jira product key
				expect(mockGetExperimentValue).toHaveBeenNthCalledWith(
					1,
					'test-boolean',
					'isEnabled',
					false,
					{ fireExperimentExposure: true },
				);
			});
		},
	);
});

describe('UFO feature flag reporting (expVal)', () => {
	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockClear();
		(addFeatureFlagAccessed as jest.Mock).mockClear();
	});

	afterEach(() => {
		// @ts-ignore
		setupEditorExperiments(undefined, {}, {});
		jest.clearAllMocks();
	});

	test('expVal calls addFeatureFlagAccessed when UFO gate is enabled', () => {
		setupEditorExperiments('confluence');
		// First call: the real experiment value; second call: UFO gate returns true
		mockGetExperimentValue.mockReturnValueOnce(true).mockReturnValueOnce(true);

		// @ts-expect-error
		expVal('test-boolean', 'isEnabled', false);

		expect(addFeatureFlagAccessed).toHaveBeenCalledWith(
			'confluence_boolean_example:isEnabled',
			true,
		);
	});

	test('expVal does not call addFeatureFlagAccessed when UFO gate is disabled', () => {
		setupEditorExperiments('confluence');
		// First call: the real experiment value; second call: UFO gate returns false
		mockGetExperimentValue.mockReturnValueOnce(true).mockReturnValueOnce(false);

		// @ts-expect-error
		expVal('test-boolean', 'isEnabled', false);

		expect(addFeatureFlagAccessed).not.toHaveBeenCalled();
	});

	test('expValNoExposure calls addFeatureFlagAccessed when UFO gate is enabled', () => {
		setupEditorExperiments('confluence');
		// First call: the real experiment value; second call: UFO gate returns true
		mockGetExperimentValue.mockReturnValueOnce(true).mockReturnValueOnce(true);

		// @ts-expect-error
		expValNoExposure('test-boolean', 'isEnabled', false);

		expect(addFeatureFlagAccessed).toHaveBeenCalledWith(
			'confluence_boolean_example:isEnabled',
			true,
		);
	});
});
