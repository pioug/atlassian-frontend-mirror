import { isFedRamp } from '@atlaskit/atlassian-context/is-fedramp';

import { type BaseClientOptions, type OptionsWithDefaults, PerimeterType } from './types';

export const getOptionsWithDefaults = <T extends BaseClientOptions>(
	options: T,
): OptionsWithDefaults<T> => ({
	/**
	 * If more federal PerimeterTypes are added in the future, this should be updated so
	 * that isFedRamp() === true always returns the strictest perimeter.
	 */
	perimeter: isFedRamp() ? PerimeterType.FEDRAMP_MODERATE : PerimeterType.COMMERCIAL,
	...options,
});
