import { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';
import { ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo/experience-types';

const COMPONENT_NAME = 'smart-hooks.use-user-recommendations';

export const UsersFetchedUfoExperience: ConcurrentExperience = new ConcurrentExperience(
	'users-fetched',
	{
		platform: { component: COMPONENT_NAME },
		type: ExperienceTypes.Load,
		performanceType: ExperiencePerformanceTypes.InlineResult,
	},
);
