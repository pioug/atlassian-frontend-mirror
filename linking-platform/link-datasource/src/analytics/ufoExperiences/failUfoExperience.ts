import type { UfoExperience } from './types';
import { ufoExperiences } from './ufoExperiences';

export const failUfoExperience = ({ name, metadata }: UfoExperience, id: string): void => {
	const experienceInstance = ufoExperiences[name].getInstance(id);
	experienceInstance.failure({ metadata });
};
