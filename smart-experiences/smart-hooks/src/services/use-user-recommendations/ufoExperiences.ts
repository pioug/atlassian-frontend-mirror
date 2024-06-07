import { ConcurrentExperience, ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo';

const COMPONENT_NAME = 'smart-hooks.use-user-recommendations';

export const UsersFetchedUfoExperience = new ConcurrentExperience('users-fetched', {
	platform: { component: COMPONENT_NAME },
	type: ExperienceTypes.Load,
	performanceType: ExperiencePerformanceTypes.InlineResult,
});
