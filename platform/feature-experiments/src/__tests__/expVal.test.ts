/**
 * Tests for @atlaskit/platform-feature-experiments.
 *
 * In tests, the jest moduleNameMapper replaces @atlaskit/platform-feature-experiments
 * with @atlassian/experiment-test-utils, so expVal etc. reads from the mock state.
 * This file tests both the production FeatureGates path (via direct relative import) and
 * the mock path (via @atlassian/experiment-test-utils which is what real consumers get).
 */

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

// Import from @atlassian/experiment-test-utils/exp-val directly — this is what consumers use.
// In real consumer tests, expVal is also from @atlassian/experiment-test-utils/exp-val via moduleNameMapper.
import { expVal } from '@atlassian/experiment-test-utils/exp-val';
import { UNSAFE_expValNoExposure } from '@atlassian/experiment-test-utils/unsafe-exp-val-no-exposure';
import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { resetAllExperiments } from '@atlassian/experiment-test-utils/reset-all-experiments';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';

// Also import production expVal for the FeatureGates path tests.
import { expVal as productionExpVal } from '../exp-val';
import { UNSAFE_expValNoExposure as productionUNSAFE_expValNoExposure } from '../unsafe-exp-val-no-exposure';

jest.mock('@atlaskit/feature-gate-js-client/feature-gates', () => ({
	__esModule: true,
	default: {
		initializeCompleted: jest.fn(() => true),
		getExperimentValue: jest.fn(),
	},
}));

jest.mock('@atlaskit/react-ufo/feature-flags-accessed', () => ({
	addFeatureFlagAccessed: jest.fn(),
}));

const mockFeatureGates = FeatureGates as jest.Mocked<typeof FeatureGates>;

// ---------------------------------------------------------------------------
// Mock path — what consumer tests experience via moduleNameMapper
// ---------------------------------------------------------------------------

describe('expVal mock path (via @atlassian/experiment-test-utils)', () => {
	afterEach(() => {
		resetAllExperiments();
		jest.clearAllMocks();
	});

	it('mockExpEnabled returns true for isEnabled param', () => {
		mockExpEnabled('test_boolean_exp');
		expect(expVal('test_boolean_exp', 'isEnabled', false)).toBe(true);
	});

	it('mockExpDisabled returns false for isEnabled param', () => {
		mockExpDisabled('test_boolean_exp');
		expect(expVal('test_boolean_exp', 'isEnabled', false)).toBe(false);
	});

	it('mockExp supports multivariate params', () => {
		mockExp('test_multivariate_exp', { variant: 'treatment', retries: 3 });
		expect(expVal('test_multivariate_exp', 'variant', 'control')).toBe('treatment');
		expect(expVal('test_multivariate_exp', 'retries', 0)).toBe(3);
	});

	it('unmocked experiment returns defaultValue', () => {
		const result = expVal('test_boolean_exp', 'isEnabled', false);
		expect(result).toBe(false);
	});

	it('mockExp throws if same experiment is mocked twice', () => {
		mockExpEnabled('test_boolean_exp');
		expect(() => mockExpEnabled('test_boolean_exp')).toThrow('test_boolean_exp was already mocked');
	});

	it('wasExperimentExposed tracks exposure calls', () => {
		mockExpEnabled('test_boolean_exp');
		expect(wasExperimentExposed('test_boolean_exp')).toBe(false);
		expVal('test_boolean_exp', 'isEnabled', false); // fires exposure
		expect(wasExperimentExposed('test_boolean_exp')).toBe(true);
	});

	it('UNSAFE_expValNoExposure does not log exposure', () => {
		mockExpEnabled('test_boolean_exp');
		UNSAFE_expValNoExposure('test_boolean_exp', 'isEnabled', false);
		expect(wasExperimentExposed('test_boolean_exp')).toBe(false);
	});

	it('resetAllExperiments clears mocks and exposures between tests', () => {
		mockExpEnabled('test_boolean_exp');
		expVal('test_boolean_exp', 'isEnabled', false);
		resetAllExperiments();
		expect(wasExperimentExposed('test_boolean_exp')).toBe(false);
		expect(expVal('test_boolean_exp', 'isEnabled', false)).toBe(false); // defaultValue
	});
});

// ---------------------------------------------------------------------------
// Production path — tests the real FeatureGates integration directly
// ---------------------------------------------------------------------------

describe('expVal production path (real FeatureGates)', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('calls FeatureGates.getExperimentValue and returns its value', () => {
		mockFeatureGates.initializeCompleted.mockReturnValue(true);
		mockFeatureGates.getExperimentValue.mockReturnValue('treatment');
		const result = productionExpVal('test_boolean_exp', 'isEnabled', false);
		expect(mockFeatureGates.getExperimentValue).toHaveBeenCalledWith(
			'test_boolean_exp',
			'isEnabled',
			false,
			{ fireExperimentExposure: true },
		);
		expect(result).toBe('treatment');
	});

	it('falls back to defaultValue when FeatureGates not initialized', () => {
		mockFeatureGates.initializeCompleted.mockReturnValue(false);
		const result = productionExpVal('test_boolean_exp', 'isEnabled', false);
		expect(result).toBe(false);
		expect(mockFeatureGates.getExperimentValue).not.toHaveBeenCalled();
	});

	it('UNSAFE_expValNoExposure passes fireExperimentExposure: false', () => {
		mockFeatureGates.initializeCompleted.mockReturnValue(true);
		mockFeatureGates.getExperimentValue.mockReturnValue(false);
		productionUNSAFE_expValNoExposure('test_boolean_exp', 'isEnabled', false);
		expect(mockFeatureGates.getExperimentValue).toHaveBeenCalledWith(
			'test_boolean_exp',
			'isEnabled',
			false,
			{ fireExperimentExposure: false },
		);
	});
});

// ---------------------------------------------------------------------------
// TYPE-LEVEL TESTS
// ---------------------------------------------------------------------------
function typeTests() {
	// ✅ Any string experiment name is accepted
	productionExpVal('test_boolean_exp', 'isEnabled', false);

	productionExpVal('some_unregistered_experiment', 'isEnabled', false);

	// ❌ defaultValue: true is banned
	// @ts-expect-error
	productionExpVal('test_boolean_exp', 'isEnabled', true);
}
// Invoke so TypeScript considers `typeTests` used — it never actually runs
// because the @ts-expect-error lines would throw at compile time if types regress.
void typeTests;
