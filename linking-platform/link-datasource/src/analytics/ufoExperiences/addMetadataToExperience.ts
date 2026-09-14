import type { CustomData } from '@atlaskit/ufo/types';

import type { UfoExperience } from './types';
import { ufoExperiences } from './ufoExperiences';

export const addMetadataToExperience = ({ name, metadata }: UfoExperience, id: string): void => {
	ufoExperiences[name].getInstance(id).addMetadata(metadata as CustomData);
};
