/**
 * Tests for @atlaskit/platform-feature-experiments/dev-override.
 *
 * These test the UNSAFE_overrideExperiment / UNSAFE_clearExperimentOverride /
 * UNSAFE_restoreExperimentOverrides APIs used by dev tooling (local examples, Gemini VR harness).
 */

import {
	UNSAFE_overrideExperiment,
	UNSAFE_clearExperimentOverride,
	UNSAFE_restoreExperimentOverrides,
	UNSAFE_getExperimentOverrides,
} from '../dev-override';

// Import the production helpers directly (not via moduleNameMapper)
import { expVal } from '../exp-val';
import { isExperimentEnabled } from '../is-experiment-enabled';

// Reset dev overrides between tests
afterEach(() => {
	// Clear all overrides by restoring an empty map
	UNSAFE_restoreExperimentOverrides({});
});

describe('UNSAFE_overrideExperiment', () => {
	it('overrides a boolean experiment', () => {
		UNSAFE_overrideExperiment('my_exp', { isEnabled: true });
		expect(isExperimentEnabled('my_exp')).toBe(true);
	});

	it('overrides a boolean experiment to false', () => {
		UNSAFE_overrideExperiment('my_exp', { isEnabled: false });
		expect(isExperimentEnabled('my_exp')).toBe(false);
	});

	it('overrides a multivariate experiment param', () => {
		UNSAFE_overrideExperiment('multi_exp', { variant: 'treatment' });
		expect(expVal('multi_exp', 'variant', 'control')).toBe('treatment');
	});

	it('overrides multiple params', () => {
		UNSAFE_overrideExperiment('multi_exp', { variant: 'treatment', retries: 3 });
		expect(expVal('multi_exp', 'variant', 'control')).toBe('treatment');
		expect(expVal('multi_exp', 'retries', 0)).toBe(3);
	});

	it('falls back to defaultValue for unset params', () => {
		UNSAFE_overrideExperiment('my_exp', { isEnabled: true });
		expect(expVal('my_exp', 'otherParam', 'fallback')).toBe('fallback');
	});

	it('overwriting an existing override replaces it', () => {
		UNSAFE_overrideExperiment('my_exp', { isEnabled: true });
		UNSAFE_overrideExperiment('my_exp', { isEnabled: false });
		expect(isExperimentEnabled('my_exp')).toBe(false);
	});
});

describe('UNSAFE_clearExperimentOverride', () => {
	it('removes a specific override', () => {
		UNSAFE_overrideExperiment('my_exp', { isEnabled: true });
		UNSAFE_clearExperimentOverride('my_exp');
		// Without override, Statsig is not initialized so returns defaultValue
		expect(isExperimentEnabled('my_exp')).toBe(false);
	});

	it('silently does nothing for non-existent override', () => {
		expect(() => UNSAFE_clearExperimentOverride('nonexistent')).not.toThrow();
	});

	it('only removes the named override, not others', () => {
		UNSAFE_overrideExperiment('exp_a', { isEnabled: true });
		UNSAFE_overrideExperiment('exp_b', { isEnabled: true });
		UNSAFE_clearExperimentOverride('exp_a');
		expect(isExperimentEnabled('exp_a')).toBe(false);
		expect(isExperimentEnabled('exp_b')).toBe(true);
	});
});

describe('UNSAFE_restoreExperimentOverrides', () => {
	it('restores a set of overrides', () => {
		UNSAFE_restoreExperimentOverrides({
			my_exp: { isEnabled: true },
			other_exp: { variant: 'treatment' },
		});
		expect(isExperimentEnabled('my_exp')).toBe(true);
		expect(expVal('other_exp', 'variant', 'control')).toBe('treatment');
	});

	it('replacing overrides clears previous ones', () => {
		UNSAFE_overrideExperiment('old_exp', { isEnabled: true });
		UNSAFE_restoreExperimentOverrides({ new_exp: { isEnabled: true } });
		expect(isExperimentEnabled('old_exp')).toBe(false);
		expect(isExperimentEnabled('new_exp')).toBe(true);
	});

	it('restoring empty object clears all overrides', () => {
		UNSAFE_overrideExperiment('my_exp', { isEnabled: true });
		UNSAFE_restoreExperimentOverrides({});
		expect(isExperimentEnabled('my_exp')).toBe(false);
	});
});

describe('UNSAFE_getExperimentOverrides', () => {
	it('returns empty object when no overrides set', () => {
		expect(UNSAFE_getExperimentOverrides()).toEqual({});
	});

	it('returns all current overrides', () => {
		UNSAFE_overrideExperiment('exp_a', { isEnabled: true });
		UNSAFE_overrideExperiment('exp_b', { variant: 'treatment' });
		const overrides = UNSAFE_getExperimentOverrides();
		expect(overrides).toEqual({
			exp_a: { isEnabled: true },
			exp_b: { variant: 'treatment' },
		});
	});

	it('returns a snapshot — mutations do not affect the store', () => {
		UNSAFE_overrideExperiment('my_exp', { isEnabled: true });
		const overrides = UNSAFE_getExperimentOverrides();
		// Mutate the returned object
		overrides['my_exp'] = { isEnabled: false };
		// Original store is unchanged
		expect(isExperimentEnabled('my_exp')).toBe(true);
	});
});
