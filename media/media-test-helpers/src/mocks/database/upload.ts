import { MediaUpload } from '@atlaskit/media-client';
import * as uuid from 'uuid';
import { ChunkId } from './chunk';
import { getFutureDate } from './mockData';

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
