import { type FileStatus as CommonFileStatus } from '@atlaskit/media-common';
import { type MediaStoreResponse } from '../client/media-store';
import { type MediaItemDetails, type MediaFile } from './media';

import {
	type FilePreview,
	type FileState,
	type ErrorFileState,
	type UploadingFileState,
	type ProcessingFileState,
	type ProcessedFileState,
	type ProcessingFailedState,
} from '@atlaskit/media-state';

export type FileStatus = CommonFileStatus;

export interface PreviewOptions {}
export interface GetFileOptions {
	preview?: PreviewOptions;
	collectionName?: string;
	occurrenceKey?: string;
	includeHashForDuplicateFiles?: boolean;
}

export interface PreviewableFileState {
	preview: FilePreview | Promise<FilePreview>;
}

export type NonErrorFileState = Exclude<FileState, ErrorFileState>;

export const isUploadingFileState = (fileState: FileState): fileState is UploadingFileState =>
	fileState.status === 'uploading';

export const isProcessingFileState = (fileState: FileState): fileState is ProcessingFileState =>
	fileState.status === 'processing';

export const isProcessedFileState = (fileState: FileState): fileState is ProcessedFileState =>
	fileState.status === 'processed';

export const isErrorFileState = (fileState: FileState): fileState is ErrorFileState =>
	fileState.status === 'error';

export const isPreviewableFileState = (
	fileState: FileState,
): fileState is Exclude<FileState, ErrorFileState> & PreviewableFileState =>
	!isErrorFileState(fileState) && !!fileState.preview;

export const isFinalFileState = (
	fileState: FileState,
): fileState is ProcessedFileState | ErrorFileState | ProcessingFailedState =>
	['processed', 'failed-processing', 'error'].includes(fileState.status);

export const isImageRepresentationReady = (fileState: FileState): boolean => {
	switch (fileState.status) {
		case 'processing':
		case 'processed':
		case 'failed-processing':
			return !!(fileState.representations && fileState.representations.image);
		default:
			return false;
	}
};

export const mapMediaFileToFileState = (mediaFile: MediaStoreResponse<MediaFile>): FileState => {
	const {
		id,
		name,
		size,
		processingStatus,
		artifacts,
		mediaType,
		mimeType,
		representations,
		createdAt,
		metadataTraceContext,
		hash,
		abuseClassification,
	} = mediaFile.data;
	const baseState = {
		id,
		name,
		size,
		mediaType,
		mimeType,
		artifacts,
		representations,
		createdAt,
		hash,
		metadataTraceContext,
		abuseClassification,
	};

	switch (processingStatus) {
		case 'pending':
		case undefined:
			return {
				...baseState,
				status: 'processing',
			};
		case 'succeeded':
			return {
				...baseState,
				status: 'processed',
			};
		case 'failed':
			return {
				...baseState,
				status: 'failed-processing',
			};
	}
};

export const mapMediaItemToFileState = (id: string, item: MediaItemDetails): FileState => {
	return mapMediaFileToFileState({
		data: {
			id,
			...item,
		},
	});
};
