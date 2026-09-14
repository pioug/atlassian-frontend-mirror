import { getValueFromSessionStorage } from './getValueFromSessionStorage';
import { MEDIA_API_ENVIRONMENT } from './MediaStore';

export const getMediaEnvironment = (): string | undefined => {
	return getValueFromSessionStorage(MEDIA_API_ENVIRONMENT);
};
