import { getFeatureFlagKeysAllProducts } from '@atlaskit/media-common';
import { ConcurrentExperience } from '@atlaskit/ufo/concurrent-experience';
import type { UFOExperience } from '@atlaskit/ufo/experience';
import { ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo/experience-types';

import type { ComponentName } from './analytics';

let ufoExperience: ConcurrentExperience | undefined;

export function getMediaUploadUfoExperience(
	id: string,
	componentName?: ComponentName,
): UFOExperience | undefined {
	if (!ufoExperience) {
		if (!componentName) {
			return undefined;
		}
		const inlineExperience = {
			platform: { component: `media-picker-${componentName}` },
			type: ExperienceTypes.Experience,
			performanceType: ExperiencePerformanceTypes.InlineResult,
			featureFlags: getFeatureFlagKeysAllProducts(),
		};
		ufoExperience = new ConcurrentExperience('media-upload', inlineExperience);
	}
	return ufoExperience.getInstance(id);
}
