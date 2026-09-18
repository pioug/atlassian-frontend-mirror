import { getMediaEnvironment, getMediaRegion } from '@atlaskit/media-client';

import { getMediaUploadUfoExperience } from './getMediaUploadUfoExperience';
import type { UFOFailedEventPayload } from './UFOFailedEventPayload';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const failMediaUploadUfoExperience = (
	id: string,
	properties?: UFOFailedEventPayload,
): void => {
	const refinedMetadata = {
		...properties,
		packageName,
		packageVersion,
		mediaEnvironment: getMediaEnvironment(),
		mediaRegion: getMediaRegion(),
	};
	getMediaUploadUfoExperience(id)?.failure({
		metadata: refinedMetadata,
	});
};
