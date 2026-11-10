import { fg } from '@atlaskit/platform-feature-flags/fg';
import type { CustomData } from '@atlaskit/ufo/types';

import type { UfoExperienceName } from './UfoExperienceName';
import { ufoExperiences } from './ufoExperiences';

export const startUfoExperience = (
	experienceName: UfoExperienceName,
	id: string,
	properties?: CustomData,
	/**
	 * Optional start time (`performance.now()` based). Defaults to now.
	 * Only applied when `platform_smartlink_cardssr_missing_events` is enabled.
	 */
	startTime?: number,
): void => {
	const experience = ufoExperiences[experienceName].getInstance(id);
	if (fg('platform_smartlink_cardssr_missing_events')) {
		experience.start(startTime);
	} else {
		experience.start();
	}
	if (properties) {
		experience.addMetadata(properties);
	}
};
