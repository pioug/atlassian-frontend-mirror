import { ExperiencePerformanceTypes, ExperienceTypes, UFOExperience } from '@atlaskit/ufo';

export const renderShareDialogExp = new UFOExperience('render-share-dialog', {
	type: ExperienceTypes.Experience,
	performanceType: ExperiencePerformanceTypes.InlineResult,
	platform: { component: 'people' },
});

export const shareSubmitExp = new UFOExperience('share-submit-action', {
	type: ExperienceTypes.Experience,
	performanceType: ExperiencePerformanceTypes.InlineResult,
	platform: { component: 'people' },
});
