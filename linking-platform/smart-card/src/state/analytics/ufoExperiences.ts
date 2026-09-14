import { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';
import { ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo/experience-types';

type UfoExperienceName =
	| 'smart-link-rendered'
	| 'smart-link-authenticated'
	| 'smart-link-action-invocation'
	| 'smart-link-ai-summary';

const inlineExperience = {
	platform: { component: 'smart-links' },
	type: ExperienceTypes.Experience,
	performanceType: ExperiencePerformanceTypes.InlineResult,
};

const renderExperience = {
	platform: { component: 'smart-links' },
	type: ExperienceTypes.Load,
	performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
};

const aiExperience = {
	platform: { component: 'smart-links' },
	type: ExperienceTypes.Experience,
	performanceType: ExperiencePerformanceTypes.InlineResult,
};

export const ufoExperiences: Record<UfoExperienceName, ConcurrentExperience> = {
	'smart-link-rendered': new ConcurrentExperience('smart-link-rendered', renderExperience),
	'smart-link-authenticated': new ConcurrentExperience(
		'smart-link-authenticated',
		inlineExperience,
	),
	'smart-link-action-invocation': new ConcurrentExperience(
		'smart-link-action-invocation',
		inlineExperience,
	),
	'smart-link-ai-summary': new ConcurrentExperience('smart-link-ai-summary', aiExperience),
};
