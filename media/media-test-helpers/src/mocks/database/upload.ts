import { type MediaUpload } from '@atlaskit/media-client';
import * as uuid from 'uuid';
import { type ChunkId } from './chunk';
import { getFutureDate } from '../../utils/mockData';

export type Upload = MediaUpload & {
	chunks: ChunkId[];
};

export function createUpload(): Upload {
	return {
		id: uuid.v4(),
		created: Date.now(),
		expires: getFutureDate().valueOf(),
		chunks: [],
	};
}
