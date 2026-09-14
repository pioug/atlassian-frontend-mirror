import type { UFOExperience } from '@atlaskit/ufo/experience';

import { type WithSamplingUFOExperience } from './samplingUfo';

export const hasUfoMarked = (
	ufoExperience: UFOExperience | WithSamplingUFOExperience,
	name: string,
): boolean => {
	return ufoExperience.metrics.marks.some((mask) => mask.name === name);
};
