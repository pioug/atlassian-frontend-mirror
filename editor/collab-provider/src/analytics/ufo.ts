import { ExperiencePerformanceTypes, ExperienceTypes, UFOExperience } from '@atlaskit/ufo';
import type AnalyticsHelper from './analytics-helper';

const createDocumentInitExperience: () => UFOExperience = () =>
	new UFOExperience('collab-provider.document-init', {
		type: ExperienceTypes.Load,
		performanceType: ExperiencePerformanceTypes.Custom,
		performanceConfig: {
			histogram: {
				[ExperiencePerformanceTypes.Custom]: {
					duration: '250_500_1000_1500_2000_3000_4000',
				},
			},
		},
	});

const withErrorHandling = (
	createExperience: () => UFOExperience,
	analyticsHelper: AnalyticsHelper | undefined,
): UFOExperience | undefined => {
	let initExperience: UFOExperience | undefined;

	try {
		initExperience = createExperience();
	} catch (error) {
		analyticsHelper?.sendErrorEvent(error, 'Error while initialising a UFO experience');
	}

	return initExperience;
};

export const createDocInitExp = (
	analyticsHelper: AnalyticsHelper | undefined,
): UFOExperience | undefined => withErrorHandling(createDocumentInitExperience, analyticsHelper);
