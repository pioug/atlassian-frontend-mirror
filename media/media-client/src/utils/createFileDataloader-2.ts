import Dataloader from 'dataloader';

import type { MediaStore } from '../client/media-store/MediaStore';
import { createBatchLoadingFunc } from './createBatchLoadingFunc';
import { MAX_BATCH_SIZE } from './createFileDataLoader';
import type { DataloaderKey, DataloaderResult } from './createFileDataLoader';

export function createFileDataloader(
	mediaStore: MediaStore,
): Dataloader<DataloaderKey, DataloaderResult> {
	return new Dataloader<DataloaderKey, DataloaderResult>(createBatchLoadingFunc(mediaStore), {
		maxBatchSize: MAX_BATCH_SIZE,
	});
}
