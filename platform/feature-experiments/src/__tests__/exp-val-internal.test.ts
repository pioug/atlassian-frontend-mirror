/**
 * Tests for expValInternal — specifically the `defaultBooleanExperimentsToTrue` test-harness
 * behaviour added to support editor VR / integration tests without a static experiment registry.
 *
 * All tests import the internal helpers directly (bypassing moduleNameMapper) so they exercise
 * the real production code path, not the @atlassian/experiment-test-utils mock layer.
 */

import { devOverrides, setDefaultBooleanExperimentsToTrue } from '../_internal/dev-overrides-store';
import { expValInternal } from '../_internal/exp-val-internal';
import {
	UNSAFE_setupPlatformExperiments,
	UNSAFE_teardownPlatformExperiments,
} from '../dev-override';

jest.mock('@atlaskit/feature-gate-js-client/feature-gates', () => ({
	__esModule: true,
	default: {
		initializeCompleted: jest.fn(() => false),
		getExperimentValue: jest.fn(),
	},
}));

jest.mock('@atlaskit/react-ufo/feature-flags-accessed', () => ({
	addFeatureFlagAccessed: jest.fn(),
}));

afterEach(() => {
	UNSAFE_teardownPlatformExperiments();
});

// ---------------------------------------------------------------------------
// defaultBooleanExperimentsToTrue = false (default)
// ---------------------------------------------------------------------------

describe('expValInternal — defaultBooleanExperimentsToTrue disabled (default)', () => {
	it('returns defaultValue for unmocked boolean isEnabled when flag is off', () => {
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(false);
	});

	it('returns defaultValue for string params regardless', () => {
		expect(expValInternal('my_exp', 'variant', 'control', true)).toBe('control');
	});

	it('devOverride takes priority over defaultValue', () => {
		devOverrides.set('my_exp', { isEnabled: true });
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(true);
		devOverrides.delete('my_exp');
	});
});

// ---------------------------------------------------------------------------
// defaultBooleanExperimentsToTrue = true (via UNSAFE_setupPlatformExperiments)
// ---------------------------------------------------------------------------

describe('expValInternal — defaultBooleanExperimentsToTrue enabled', () => {
	beforeEach(() => {
		UNSAFE_setupPlatformExperiments(true);
	});

	it('returns true for boolean isEnabled param when not overridden', () => {
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(true);
	});

	it('does NOT affect string params — still returns defaultValue', () => {
		expect(expValInternal('my_exp', 'variant', 'control', true)).toBe('control');
	});

	it('does NOT affect params where defaultValue is not false — only defaultValue:false is treated specially', () => {
		// Non-boolean isEnabled param — defaultValue is a string so it falls through
		expect(expValInternal('my_exp', 'isEnabled', 'off', true)).toBe('off');
	});

	it('devOverride (isEnabled: false) takes priority over default-to-true', () => {
		devOverrides.set('my_exp', { isEnabled: false });
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(false);
		devOverrides.delete('my_exp');
	});

	it('devOverride (isEnabled: true) still returns true', () => {
		devOverrides.set('my_exp', { isEnabled: true });
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(true);
		devOverrides.delete('my_exp');
	});

	it('after UNSAFE_teardownPlatformExperiments, returns defaultValue again', () => {
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(true);
		UNSAFE_teardownPlatformExperiments();
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// UNSAFE_setupPlatformExperiments — explicit overrides
// ---------------------------------------------------------------------------

describe('UNSAFE_setupPlatformExperiments — explicit overrides', () => {
	it('boolean override (true) sets devOverrides and takes priority', () => {
		UNSAFE_setupPlatformExperiments(true, { my_exp: true });
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(true);
	});

	it('boolean override (false) keeps experiment disabled even in default-to-true mode', () => {
		UNSAFE_setupPlatformExperiments(true, { my_exp: false });
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(false);
	});

	it('string override sets cohort param', () => {
		UNSAFE_setupPlatformExperiments(true, { my_exp: 'treatment' });
		expect(expValInternal('my_exp', 'cohort', 'control', true)).toBe('treatment');
	});

	it('non-overridden experiment still defaults to true when enableDefaultToTrue=true', () => {
		UNSAFE_setupPlatformExperiments(true, { other_exp: false });
		// my_exp not in overrides — should still default to true
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(true);
	});

	it('enableDefaultToTrue=false only applies explicit overrides, others stay at defaultValue', () => {
		UNSAFE_setupPlatformExperiments(false, { my_exp: true });
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(true);
		expect(expValInternal('other_exp', 'isEnabled', false, true)).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// setDefaultBooleanExperimentsToTrue — direct flag manipulation
// ---------------------------------------------------------------------------

describe('setDefaultBooleanExperimentsToTrue — direct flag', () => {
	afterEach(() => {
		setDefaultBooleanExperimentsToTrue(false);
	});

	it('when set to true, boolean isEnabled defaults to true', () => {
		setDefaultBooleanExperimentsToTrue(true);
		expect(expValInternal('any_exp', 'isEnabled', false, true)).toBe(true);
	});

	it('when set back to false, returns defaultValue', () => {
		setDefaultBooleanExperimentsToTrue(true);
		setDefaultBooleanExperimentsToTrue(false);
		expect(expValInternal('any_exp', 'isEnabled', false, true)).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// UNSAFE_teardownPlatformExperiments
// ---------------------------------------------------------------------------

describe('UNSAFE_teardownPlatformExperiments', () => {
	it('clears devOverrides', () => {
		UNSAFE_setupPlatformExperiments(true, { my_exp: true });
		UNSAFE_teardownPlatformExperiments();
		// devOverrides cleared — falls through to defaultBooleanExperimentsToTrue (now false) → defaultValue
		expect(expValInternal('my_exp', 'isEnabled', false, true)).toBe(false);
	});

	it('resets defaultBooleanExperimentsToTrue to false', () => {
		UNSAFE_setupPlatformExperiments(true);
		UNSAFE_teardownPlatformExperiments();
		expect(expValInternal('any_exp', 'isEnabled', false, true)).toBe(false);
	});

	it('is safe to call multiple times', () => {
		UNSAFE_setupPlatformExperiments(true);
		expect(() => {
			UNSAFE_teardownPlatformExperiments();
			UNSAFE_teardownPlatformExperiments();
		}).not.toThrow();
	});
});
