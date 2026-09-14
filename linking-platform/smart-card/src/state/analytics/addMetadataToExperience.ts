import type { CustomData } from '@atlaskit/ufo/types';

import type { UfoExperienceName } from './UfoExperienceName';
import { ufoExperiences } from './ufoExperiences';

export const addMetadataToExperience = (
	experienceName: UfoExperienceName,
	id: string,
	properties: CustomData,
): void => {
	ufoExperiences[experienceName].getInstance(id).addMetadata(properties);
};
