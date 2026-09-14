import type Dataloader from 'dataloader';
import { type LRUMap } from 'lru_map';
import { type Interpreter } from 'xstate';

import { getMediaTypeFromMimeType } from '@atlaskit/media-common';
import type {
	ErrorFileState,
	FileState,
	UploadingFileState,
} from '@atlaskit/media-state/file-state';
import { type MediaStore, mediaStore } from '@atlaskit/media-state/media-store';

import { getFileStreamsCache } from '../file-streams-cache';
import {
	type MobileUpload,
	type MobileUploadStartEvent,
	type MobileUploadProgressEvent,
	type MobileUploadEndEvent,
	type MobileUploadErrorEvent,
} from '../models/mobile-upload';
import type { DataloaderKey, DataloaderResult } from '../utils/createFileDataLoader';
import { createFileDataloader } from '../utils/createFileDataloader-2';
import { createMobileFileStateSubject } from '../utils/mobileUpload/createMobileFileStateSubject';
import { createServicesCache } from '../utils/mobileUpload/servicesCache';
import { createMobileUploadService } from '../utils/mobileUpload/stateMachine/createMobileUploadService';
import { createMobileUploadStateMachine } from '../utils/mobileUpload/stateMachine/createMobileUploadStateMachine';
import type {
	StateMachineContext,
	StateMachineSchema,
	StateMachineEvent,
	StateMachineTypestate,
} from '../utils/mobileUpload/stateMachine/types';
import type { MediaStore as MediaApi } from './media-store/MediaStore';
export class MobileUploadImpl implements MobileUpload {
	private readonly dataloader: Dataloader<DataloaderKey, DataloaderResult>;
	private readonly servicesCache: LRUMap<
		string,
		Interpreter<StateMachineContext, StateMachineSchema, StateMachineEvent, StateMachineTypestate>
	>;

	constructor(
		mediaApi: MediaApi,
		private readonly store: MediaStore = mediaStore,
	) {
		this.dataloader = createFileDataloader(mediaApi);
		this.servicesCache = createServicesCache();
	}

	public notifyUploadStart(event: MobileUploadStartEvent): void {
		const {
			fileId,
			collectionName,
			occurrenceKey,
			fileName,
			fileSize,
			fileMimetype,
			preview,
			createdAt,
		} = event;

		const mediaType = getMediaTypeFromMimeType(fileMimetype);

		const initialState: UploadingFileState = {
			status: 'uploading',
			id: fileId,
			occurrenceKey,
			name: fileName,
			size: fileSize,
			progress: 0,
			mediaType,
			mimeType: fileMimetype,
			preview,
			createdAt,
		};

		const service = createMobileUploadService(
			createMobileUploadStateMachine(this.dataloader, initialState, collectionName),
		);

		const subject = createMobileFileStateSubject(service);

		subject.subscribe({
			next: (fileState: FileState) => {
				this.setFileState(fileId, fileState);
			},
			error: (err) => {
				const errorFileState: ErrorFileState = this.getErrorFileState(err, fileId, occurrenceKey);
				this.setFileState(fileId, errorFileState);
			},
		});

		this.servicesCache.set(fileId, service);
		getFileStreamsCache().set(fileId, subject);
	}

	public notifyUploadProgress(event: MobileUploadProgressEvent): void {
		const { fileId, progress } = event;

		const service = this.servicesCache.get(fileId);
		if (service) {
			service.send('UPLOAD_PROGRESS', { progress });
		}
	}

	public notifyUploadEnd(event: MobileUploadEndEvent): void {
		const { fileId } = event;

		const service = this.servicesCache.get(fileId);
		if (service) {
			service.send('UPLOAD_END');
		}
	}

	public notifyUploadError(event: MobileUploadErrorEvent): void {
		const { fileId, message } = event;

		const service = this.servicesCache.get(fileId);
		if (service) {
			service.send('UPLOAD_ERROR', { message });
		}
	}

	private getErrorFileState = (error: any, id: string, occurrenceKey?: string): ErrorFileState =>
		typeof error === 'string'
			? {
					status: 'error',
					id,
					reason: error,
					occurrenceKey,
					message: error,
				}
			: {
					status: 'error',
					id,
					reason: error?.reason,
					details: error?.attributes,
					occurrenceKey,
					message: error?.message,
				};

	private setFileState = (id: string, fileState: FileState) => {
		this.store.setState((state) => {
			state.files[id] = fileState;
		});
	};
}
