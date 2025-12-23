import {
	ConcurrentExperience,
	type CustomData,
	ExperiencePerformanceTypes,
	ExperienceTypes,
} from '@atlaskit/ufo';

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

const ufoExperiences: Record<UfoExperienceName, ConcurrentExperience> = {
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

export const succeedUfoExperience = (
	experienceName: UfoExperienceName,
	id: string,
	properties?: CustomData,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	experience.success({ metadata: properties });
};

export const failUfoExperience = (
	experienceName: UfoExperienceName,
	id: string,
	properties?: CustomData,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	experience.failure({ metadata: properties });
};

export const addMetadataToExperience = (
	experienceName: UfoExperienceName,
	id: string,
	properties: CustomData,
): void => {
	ufoExperiences[experienceName].getInstance(id).addMetadata(properties);
};
