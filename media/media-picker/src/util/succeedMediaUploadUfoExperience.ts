import type { FileAttributes } from '@atlaskit/media-common';
import { getMediaEnvironment, getMediaRegion } from '@atlaskit/media-client';

import { getMediaUploadUfoExperience } from './getMediaUploadUfoExperience';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const succeedMediaUploadUfoExperience = (id: string, properties: FileAttributes): void => {
	getMediaUploadUfoExperience(id)?.success({
		metadata: {
			fileAttributes: properties,
			packageName,
			packageVersion,
			mediaEnvironment: getMediaEnvironment(),
			mediaRegion: getMediaRegion(),
		},
	});
};
