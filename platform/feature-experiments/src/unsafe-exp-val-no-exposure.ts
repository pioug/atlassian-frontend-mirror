import { expValInternal } from './_internal/exp-val-internal';
import type { AssurePrimitives } from './_internal/types';

/**
 * Returns the value of a given parameter in an experiment config, WITHOUT firing an exposure event.
 * Only use this if you plan to fire exposure manually.
 */
export function UNSAFE_expValNoExposure<T>(
	experimentName: string,
	param: string,
	defaultValue: T extends true ? never : T,
): AssurePrimitives<T> {
	return expValInternal(experimentName, param, defaultValue, false);
}
