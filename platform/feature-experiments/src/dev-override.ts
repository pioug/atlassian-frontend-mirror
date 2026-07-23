/**
 * Dev-mode override API for @atlaskit/platform-feature-experiments.
 *
 * ⚠️ FOR DEV TOOLING AND VISUAL REGRESSION TEST HARNESSES ONLY.
 * Do NOT import this in production code or application bundles.
 * Prefixed with UNSAFE_ to signal restricted usage.
 *
 * Used by:
 * - Platform website "Manage Editor Features" dev panel (yarn start)
 * - Gemini / VR test template (platform/build/test-tooling/gemini-visual-regression)
 * - ssr-simulator.tsx example helper
 *
 * @example
 * ```ts
 * import {
 *   UNSAFE_overrideExperiment,
 *   UNSAFE_clearAllExperimentOverrides,
 * } from '@atlaskit/platform-feature-experiments/dev-override';
 *
 * // Override a boolean experiment:
 * UNSAFE_overrideExperiment('platform_editor_locale_datepicker', { isEnabled: true });
 *
 * // Override a multivariate experiment:
 * UNSAFE_overrideExperiment('platform_editor_new_nav', { cohort: 'treatment' });
 *
 * // Clear a specific override:
 * UNSAFE_clearExperimentOverride('platform_editor_locale_datepicker');
 *
 * // Clear all overrides:
 * UNSAFE_clearAllExperimentOverrides();
 * ```
 */

import { devOverrides } from './_internal/dev-overrides-store';

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
 * @param experimentName - The experiment key (e.g. 'platform_editor_locale_datepicker')
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
