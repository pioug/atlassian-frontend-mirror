import { v4 as uuid } from 'uuid'; // eslint-disable-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead

import { type ResponseFileItem } from '../../client/media-store/types';

/**
 * Makes a copy of the provided file item with a random file id
 * */
export const copy = (fileItem: ResponseFileItem): ResponseFileItem =>
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	JSON.parse(JSON.stringify(fileItem).replace(new RegExp(fileItem.id, 'g'), uuid()));
