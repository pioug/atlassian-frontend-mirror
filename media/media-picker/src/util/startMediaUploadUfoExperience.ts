import type { ComponentName } from './analytics';
import { getMediaUploadUfoExperience } from './getMediaUploadUfoExperience';

export const startMediaUploadUfoExperience = (id: string, componentName: ComponentName): void => {
	getMediaUploadUfoExperience(id, componentName)?.start();
};
