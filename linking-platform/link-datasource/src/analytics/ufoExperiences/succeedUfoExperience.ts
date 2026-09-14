import type { UfoExperience } from './types';
import { ufoExperiences } from './ufoExperiences';

export const succeedUfoExperience = ({ name, metadata }: UfoExperience, id: string): void => {
	const experienceInstance = ufoExperiences[name].getInstance(id);
	experienceInstance.success({ metadata });
};
