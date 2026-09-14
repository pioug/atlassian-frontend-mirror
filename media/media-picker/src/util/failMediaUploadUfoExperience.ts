import { getMediaEnvironment, getMediaRegion } from '@atlaskit/media-client';

import type { UFOFailedEventPayload } from './UFOFailedEventPayload';
import { getMediaUploadUfoExperience } from './getMediaUploadUfoExperience';

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
