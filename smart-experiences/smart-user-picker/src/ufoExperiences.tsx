import { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';
import { ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo/experience-types';

const COMPONENT_NAME = 'smart-user-picker';

export const smartUserPickerRenderedUfoExperience: ConcurrentExperience = new ConcurrentExperience(
	'smart-user-picker-rendered',
	{
		platform: { component: COMPONENT_NAME },
		type: ExperienceTypes.Load,
		performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
	},
);

export const smartUserPickerOptionsShownUfoExperience: ConcurrentExperience =
	new ConcurrentExperience('smart-user-picker-options-shown', {
		platform: { component: COMPONENT_NAME },
		type: ExperienceTypes.Operation,
		performanceType: ExperiencePerformanceTypes.InlineResult,
	});
