import { ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo/experience-types';

export const datasourcePageSegmentLoadExperienceConfig: any = {
	platform: { component: 'datasource' },
	type: ExperienceTypes.Load,
	performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
};
