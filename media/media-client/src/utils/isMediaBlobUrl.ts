import { mediaBlobUrlIdentifier } from './url';

export const isMediaBlobUrl = (url: string): boolean => {
	return url.indexOf(`${mediaBlobUrlIdentifier}=true`) > -1;
};
