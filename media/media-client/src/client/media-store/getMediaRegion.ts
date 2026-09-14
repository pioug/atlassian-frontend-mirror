import { getValueFromSessionStorage } from './getValueFromSessionStorage';
import { MEDIA_API_REGION } from './MediaStore';

export const getMediaRegion = (): string | undefined => {
	return getValueFromSessionStorage(MEDIA_API_REGION);
};
