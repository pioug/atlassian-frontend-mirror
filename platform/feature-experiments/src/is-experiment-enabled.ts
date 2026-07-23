import { expVal } from './exp-val';

/**
 * Checks if the experiment is enabled with `isEnabled` parameter.
 * Shortcut for `expVal(exp_key, 'isEnabled', false) === true`
 *
 * @example
 * ```ts
 * if (isExperimentEnabled('platform_editor_new_experiment')) {
 *   // Gated code
 * }
 * ```
 */
export function isExperimentEnabled(experimentName: string): boolean {
	return expVal(experimentName, 'isEnabled', null) === true;
}
