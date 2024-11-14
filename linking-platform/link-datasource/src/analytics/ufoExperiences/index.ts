import {
	ConcurrentExperience,
	type CustomData,
	ExperiencePerformanceTypes,
	ExperienceTypes,
} from '@atlaskit/ufo';

import type { UfoExperience } from './types';

const datasourcePageSegmentLoadExperienceConfig = {
	platform: { component: 'datasource' },
	type: ExperienceTypes.Load,
	performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
};

const columnPickerCustomExperienceConfig = {
	platform: { component: 'datasource' },
	type: ExperienceTypes.Operation,
	performanceType: ExperiencePerformanceTypes.Custom,
};

const inlineEditCustomExperienceConfig = {
	platform: { component: 'datasource' },
	type: ExperienceTypes.Load,
	performanceType: ExperiencePerformanceTypes.InlineResult,
};

const ufoExperiences: Record<UfoExperience['name'], ConcurrentExperience> = {
	'datasource-rendered': new ConcurrentExperience(
		'datasource-rendered',
		datasourcePageSegmentLoadExperienceConfig,
	),
	'column-picker-rendered': new ConcurrentExperience(
		'column-picker-rendered',
		columnPickerCustomExperienceConfig,
	),
	'inline-edit-rendered': new ConcurrentExperience(
		'inline-edit-rendered',
		inlineEditCustomExperienceConfig,
	),
};

export const startUfoExperience = ({ name, metadata }: UfoExperience, id: string) => {
	const experienceInstance = ufoExperiences[name].getInstance(id);
	experienceInstance.start();
	if (metadata) {
		experienceInstance.addMetadata(metadata);
	}
};

export const succeedUfoExperience = ({ name, metadata }: UfoExperience, id: string) => {
	const experienceInstance = ufoExperiences[name].getInstance(id);
	experienceInstance.success({ metadata });
};

export const failUfoExperience = ({ name, metadata }: UfoExperience, id: string) => {
	const experienceInstance = ufoExperiences[name].getInstance(id);
	experienceInstance.failure({ metadata });
};

export const addMetadataToExperience = ({ name, metadata }: UfoExperience, id: string) => {
	ufoExperiences[name].getInstance(id).addMetadata(metadata as CustomData);
};
