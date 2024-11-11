import type Dataloader from 'dataloader';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { from } from 'rxjs/observable/from';
import { map } from 'rxjs/operators/map';
import { type Interpreter } from 'xstate';

import { mapMediaItemToFileState } from '../../models/file-state';
import { type FileState } from '@atlaskit/media-state';
import { type DataloaderKey, type DataloaderResult } from '../createFileDataLoader';
import { createMediaSubject } from '../createMediaSubject';
import { isEmptyFile } from '../detectEmptyFile';
import { PollingFunction } from '../polling';
import { MobileUploadError } from './error';
import {
	type StateMachineContext,
	type StateMachineEvent,
	type StateMachineTypestate,
} from './stateMachine/types';
import { isNotFoundMediaItemDetails } from '../../models/media';

export const createMobileFileStateSubject = (
	service: Interpreter<StateMachineContext, any, StateMachineEvent, StateMachineTypestate>,
): ReplaySubject<FileState> => {
	const subject = new ReplaySubject<FileState>(1);

	from(service.start())
		.pipe(map((state) => state.context.currentFileState))
		.subscribe(subject);

	return subject;
};

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
			throw new MobileUploadError('emptyItems', id, {
				collectionName,
				occurrenceKey,
				traceContext: response.metadataTraceContext,
			});
		}

		if (isEmptyFile(response)) {
			throw new MobileUploadError('zeroVersionFile', id, {
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
