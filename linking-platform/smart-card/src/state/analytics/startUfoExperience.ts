import type { CustomData } from '@atlaskit/ufo/types';

import type { UfoExperienceName } from './UfoExperienceName';
import { ufoExperiences } from './ufoExperiences';

export const startUfoExperience = (
	experienceName: UfoExperienceName,
	id: string,
	properties?: CustomData,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	experience.start();
	if (properties) {
		experience.addMetadata(properties);
	}
};
