import {
	ConcurrentExperience,
	type CustomData,
	ExperiencePerformanceTypes,
	ExperienceTypes,
} from '@atlaskit/ufo';

export const ufoExperience = { mounted: 'component-mounted' } as const;

type ExperienceType = keyof typeof ufoExperience;
type ExperienceName = (typeof ufoExperience)[ExperienceType];

const ufoExperiences: Record<ExperienceName, ConcurrentExperience> = {
	[ufoExperience.mounted]: new ConcurrentExperience(ufoExperience.mounted, {
		type: ExperienceTypes.Load,
		performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
		platform: { component: 'link-picker' },
	}),
};

export const startUfoExperience = (
	experienceName: ExperienceName,
	id: string,
	metadata?: CustomData,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	experience.start();
	if (metadata) {
		experience.addMetadata(metadata);
	}
};

export const succeedUfoExperience = (
	experienceName: ExperienceName,
	id: string,
	metadata?: CustomData,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	experience.success({ metadata });
};

export const failUfoExperience = (
	experienceName: ExperienceName,
	id: string,
	metadata?: CustomData,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	experience.failure({ metadata });
};

export const abortUfoExperience = (
	experienceName: ExperienceName,
	id: string,
	metadata?: CustomData,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	experience.abort({ metadata });
};
