/**
 * Dev-mode override API for @atlaskit/platform-feature-experiments.
 *
 * ⚠️ FOR DEV TOOLING AND VISUAL REGRESSION TEST HARNESSES ONLY.
 * Do NOT import this in production code or application bundles.
 */

import { devOverrides, setDefaultBooleanExperimentsToTrue } from './_internal/dev-overrides-store';

// ---------------------------------------------------------------------------
// Public UNSAFE_ API
// ---------------------------------------------------------------------------

function assertNotProduction(fnName: string): void {
	if (process.env.NODE_ENV === 'production') {
		throw new Error(
			`[platform-feature-experiments] ${fnName} must not be called in production. ` +
				'Import from the dev-override subpath only in dev tooling and VR test harnesses.',
		);
	}
}

/**
 * Override experiment parameter values at runtime (dev tooling only).
 * Sets values that take priority over Statsig when the experiment is evaluated.
 *
 * @param experimentName - The experiment key (e.g. 'my_experiment')
 * @param params - The parameter overrides (e.g. { isEnabled: true } or { cohort: 'treatment' })
 */
export function UNSAFE_overrideExperiment(
	experimentName: string,
	params: Record<string, unknown>,
): void {
	assertNotProduction('UNSAFE_overrideExperiment');
	devOverrides.set(experimentName, params);
}

/**
 * Remove a dev override for a specific experiment.
 * After calling this, the experiment will evaluate from Statsig again.
 */
export function UNSAFE_clearExperimentOverride(experimentName: string): void {
	assertNotProduction('UNSAFE_clearExperimentOverride');
	devOverrides.delete(experimentName);
}

/**
 * Remove all dev overrides.
 * After calling this, all experiments evaluate from Statsig again.
 */
export function UNSAFE_clearAllExperimentOverrides(): void {
	assertNotProduction('UNSAFE_clearAllExperimentOverrides');
	devOverrides.clear();
}

/**
 * Get a snapshot of all current dev overrides.
 * Useful for persisting to localStorage and restoring on page load.
 */
export function UNSAFE_getExperimentOverrides(): Record<string, Record<string, unknown>> {
	assertNotProduction('UNSAFE_getExperimentOverrides');
	return Object.fromEntries(devOverrides.entries());
}

/**
 * Restore dev overrides from a previously persisted snapshot (e.g. from localStorage).
 */
export function UNSAFE_restoreExperimentOverrides(
	overrides: Record<string, Record<string, unknown>>,
): void {
	assertNotProduction('UNSAFE_restoreExperimentOverrides');
	// Clear existing overrides first, then restore the provided snapshot
	devOverrides.clear();
	for (const [experimentName, params] of Object.entries(overrides)) {
		devOverrides.set(experimentName, params);
	}
}

// ---------------------------------------------------------------------------
// Test harness setup/teardown
// ---------------------------------------------------------------------------

export type PlatformExperimentOverrides = {
	[experimentName: string]: boolean | string;
};

/**
 * Set up platform experiments for testing/VR harnesses.
 * When `enableDefaultToTrue` is `true`, any boolean `isEnabled` experiment NOT in `overrides`
 * defaults to `true`. Pass explicit overrides to force specific values.
 */
export function UNSAFE_setupPlatformExperiments(
	enableDefaultToTrue: boolean,
	overrides?: PlatformExperimentOverrides,
): void {
	assertNotProduction('UNSAFE_setupPlatformExperiments');
	if (enableDefaultToTrue) {
		setDefaultBooleanExperimentsToTrue(true);
	}
	if (overrides) {
		for (const [experimentName, value] of Object.entries(overrides)) {
			if (typeof value === 'boolean') {
				devOverrides.set(experimentName, { isEnabled: value });
			} else if (typeof value === 'string') {
				devOverrides.set(experimentName, { cohort: value });
			}
		}
	}
}

/**
 * Reset platform experiment overrides and disable default-to-true mode.
 */
export function UNSAFE_teardownPlatformExperiments(): void {
	assertNotProduction('UNSAFE_teardownPlatformExperiments');
	setDefaultBooleanExperimentsToTrue(false);
	devOverrides.clear();
}
