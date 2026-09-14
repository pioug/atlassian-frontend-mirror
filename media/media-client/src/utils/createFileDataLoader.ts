import { type NotFoundMediaItemDetails, type MediaItemDetails } from '../models/media';

export const MAX_BATCH_SIZE = 100;

export type DataloaderKey = {
	readonly id: string;
	readonly collectionName?: string;
	readonly includeHashForDuplicateFiles?: boolean;
};

export type DataloaderResult = MediaItemDetails | NotFoundMediaItemDetails;

export type BatchLoadingErrorResult = {
	readonly id: string;
	readonly collection?: string;
	readonly error: Error;
};

export type FileIdsByCollection = { [collectionName: string]: string[] };
