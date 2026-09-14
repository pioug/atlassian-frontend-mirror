import { type ResponseFileItem } from '../../client/media-store/types';
import { type MediaFile } from '../../models/media';

// --------------------------------------------------------
// Utils for the main class
// --------------------------------------------------------
export const getMediaFile = (fileItem: ResponseFileItem): MediaFile => ({
	id: fileItem.id,
	...fileItem.details,
});
