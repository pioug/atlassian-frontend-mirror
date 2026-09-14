import type { UfoExperience } from './types';
import { ufoExperiences } from './ufoExperiences';

export const startUfoExperience = ({ name, metadata }: UfoExperience, id: string): void => {
	const experienceInstance = ufoExperiences[name].getInstance(id);
	experienceInstance.start();
	if (metadata) {
		experienceInstance.addMetadata(metadata);
	}
};
