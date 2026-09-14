import { ufoExperiencesSampled } from './samplingUfo';

export const clearSampled = (): void => {
	for (const prop of Object.getOwnPropertyNames(ufoExperiencesSampled)) {
		delete ufoExperiencesSampled[prop];
	}
};
