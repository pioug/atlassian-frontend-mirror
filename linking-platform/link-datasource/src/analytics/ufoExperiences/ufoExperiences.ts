import { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';

import { columnPickerCustomExperienceConfig } from './columnPickerCustomExperienceConfig';
import { datasourcePageSegmentLoadExperienceConfig } from './datasourcePageSegmentLoadExperienceConfig';
import { inlineEditCustomExperienceConfig } from './inlineEditCustomExperienceConfig';
import type { UfoExperience } from './types';

export const ufoExperiences: Record<UfoExperience['name'], ConcurrentExperience> = {
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
