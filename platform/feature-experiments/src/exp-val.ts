import { expValInternal } from './_internal/exp-val-internal';
import type { AssurePrimitives } from './_internal/types';

export type { AssurePrimitives } from './_internal/types';

/**
 * Returns the value of a given parameter in an experiment config, firing an exposure event.
 *
 * Do not pass `true` as a defaultValue — use `false` for boolean experiments or use isExperimentEnabled.
 *
 * @example
 * ```ts
 * const variant = expVal('my_experiment', 'variant', 'control');
 * ```
 */
export function expVal<T>(
	experimentName: string,
	param: string,
	defaultValue: T extends true ? never : T,
): AssurePrimitives<T> {
	return expValInternal(experimentName, param, defaultValue, true);
}
