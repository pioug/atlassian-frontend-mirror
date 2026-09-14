import type Dataloader from 'dataloader';
import type { ReplaySubject } from 'rxjs/ReplaySubject';

import type { FileState } from '@atlaskit/media-state/file-state';

import { isNotFoundMediaItemDetails } from '../../models/is-not-found-media-item-details';
import { mapMediaItemToFileState } from '../../models/map-media-item-to-file-state';
import { type DataloaderKey, type DataloaderResult } from '../createFileDataLoader';
import { createMediaSubject } from '../createMediaSubject';
import { isEmptyFile } from '../detectEmptyFile';
import { PollingFunction } from '../polling';
import { MobileUploadError } from './MobileUploadError';

export const createMobileDownloadFileStream = (
	dataloader: Dataloader<DataloaderKey, DataloaderResult>,
	id: string,
	collectionName?: string,
	occurrenceKey?: string,
): ReplaySubject<FileState> => {
	const subject = createMediaSubject<FileState>();
	const poll = new PollingFunction();

	// ensure subject errors if polling exceeds max iterations or uncaught exception in executor
	poll.onError = (error: Error) => subject.error(error);

	poll.execute(async () => {
		const response = await dataloader.load({
			id,
			collectionName,
		});

		if (isNotFoundMediaItemDetails(response)) {
			throw new MobileUploadError('emptyItems', {
				id,
				collectionName,
				occurrenceKey,
				traceContext: response.metadataTraceContext,
			});
		}

		if (isEmptyFile(response)) {
			throw new MobileUploadError('zeroVersionFile', {
				id,
				collectionName,
				occurrenceKey,
				traceContext: response.metadataTraceContext,
			});
		}

		const fileState = mapMediaItemToFileState(id, response);
		subject.next(fileState);

		switch (fileState.status) {
			case 'processing':
				// the only case for continuing polling, otherwise this function is run once only
				poll.next();
				break;
			case 'processed':
				subject.complete();
				break;
		}
	});

	return subject;
};
