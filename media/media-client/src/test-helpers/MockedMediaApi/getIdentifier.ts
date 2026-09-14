import { type ResponseFileItem } from '../../client/media-store/types';
import type { FileIdentifier } from '../../identifier';

/**
 * Extracts the file identifier from the provided file item
 */
export const getIdentifier = (fileItem: ResponseFileItem): FileIdentifier => ({
	mediaItemType: 'file',
	id: fileItem.id,
	collectionName: fileItem.collection,
});
