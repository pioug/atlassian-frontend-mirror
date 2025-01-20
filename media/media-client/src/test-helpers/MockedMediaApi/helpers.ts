import {
	type UploadingFileState,
	type ErrorFileState,
	type FileState,
	type MediaFileArtifact,
} from '@atlaskit/media-state';

import uuid from 'uuid/v4';

import { type MediaFile } from '../../models/media';
import { type ResponseFileItem } from '../../client/media-store/types';
import type { FileIdentifier } from '../../identifier';

import { type PartialResponseFileItem } from './types';
import { CommonMediaClientError, fromCommonMediaClientError } from '../../models/errors';
import { createServerUnauthorizedError } from '../mediaClientErrors';

// --------------------------------------------------------
// Factory Utils
// --------------------------------------------------------

export const normaliseInput = <T>(input?: T | T[]): T[] =>
	!input ? [] : input instanceof Array ? input : [input];

// --------------------------------------------------------
// Utils for the main class
// --------------------------------------------------------

export const getMediaFile = (fileItem: ResponseFileItem): MediaFile => ({
	id: fileItem.id,
	...fileItem.details,
});

// --------------------------------------------------------
// Utils for creating file descriptors for tests
// --------------------------------------------------------

export const createEmptyFileItem = (id: string, collection?: string): ResponseFileItem => {
	const emptyFileItem: ResponseFileItem = {
		type: 'file',
		id,
		details: {
			mediaType: 'unknown',
			mimeType: 'binary/octet-stream',
			name: '',
			size: 0,
			processingStatus: 'pending',
			artifacts: {},
			representations: {},
			createdAt: 1699488941974,
		},
	};

	if (collection) {
		emptyFileItem.collection = collection;
	}

	return emptyFileItem;
};

/**
 * Simulates the processing of the file by updating the processing status of the artifacts by a percentage
 * Percent must be between 0 and 1
 */
export const createProcessingFileItem = (
	fileItem: ResponseFileItem,
	percent: number,
): ResponseFileItem => {
	if (percent < 0 || percent > 1) {
		throw new Error('Error createProcessingFileItem: percent must be between 0 and 1');
	}

	/**
	 * This behaviour has to be confirmed
	 * Artifacts show up immediately after processed or they have a
	 * "processing time"?
	 */

	if (percent === 1) {
		return fileItem;
	}

	// No artifacts for 0% processing
	if (percent === 0) {
		return {
			...fileItem,
			details: {
				...fileItem.details,
				processingStatus: 'pending',
				artifacts: {},
				// The preview will only be ready at 100% -> TODO verify against backend
				representations: {},
			},
		};
	}

	const artifactsKeys = Object.keys(fileItem.details.artifacts);
	const artifactsEntries = Object.entries<MediaFileArtifact>({
		...fileItem.details.artifacts, // Spreading to make TS happy
	});

	// Get a % of the total artifacts to be set as processed
	const processedArtifactKeys = artifactsKeys.slice(0, Math.ceil(artifactsKeys.length * percent));

	const processedArtifactEntries = artifactsEntries.map(
		([key, artifact]): [string, MediaFileArtifact] => [
			key,
			{
				...artifact,
				processingStatus: processedArtifactKeys.includes(key) ? 'succeeded' : 'pending',
			},
		],
	);
	const artifactsProcessingPercent = Object.fromEntries(processedArtifactEntries);

	return {
		...fileItem,
		details: {
			...fileItem.details,
			processingStatus: 'pending',
			artifacts: artifactsProcessingPercent,
			// The preview will only be ready at 100% -> TODO verify against backend
			representations: {},
		},
	};
};

/**
 * Makes a copy of the provided file item with a random file id
 * */
export const copy = (fileItem: ResponseFileItem): ResponseFileItem =>
	JSON.parse(JSON.stringify(fileItem).replace(new RegExp(fileItem.id, 'g'), uuid()));

/**
 * Adds/overrides the attributes from fileItemB into the fileItemA
 * */
export const merge = (
	fileItemA?: PartialResponseFileItem,
	fileItemB?: PartialResponseFileItem,
): PartialResponseFileItem => ({
	...fileItemA,
	...fileItemB,
	details: {
		...fileItemA?.details,
		...fileItemB?.details,
		artifacts: {
			...fileItemA?.details?.artifacts,
			...fileItemB?.details?.artifacts,
		},
	},
});

/**
 * Adds/overrides the attributes from fileItemB into the fileItemA
 * */
export const assign = (
	fileItemA: ResponseFileItem,
	fileItemB?: PartialResponseFileItem,
): ResponseFileItem => ({
	...fileItemA,
	...fileItemB,
	details: {
		...fileItemA.details,
		...fileItemB?.details,
		artifacts: {
			...fileItemA.details?.artifacts,
			...fileItemB?.details?.artifacts,
		},
	},
});

/**
 * Extracts the file identifier from the provided file item
 */
export const getIdentifier = (fileItem: ResponseFileItem): FileIdentifier => ({
	mediaItemType: 'file',
	id: fileItem.id,
	collectionName: fileItem.collection,
});

export const createFileState = ({
	id,
	details: {
		name,
		size,
		mediaType,
		mimeType,
		createdAt,
		processingStatus,
		artifacts,
		representations,
	},
}: ResponseFileItem): FileState => ({
	status: processingStatus === 'succeeded' ? 'processed' : 'processing',
	id,
	name,
	size,
	mediaType,
	mimeType,
	createdAt,
	artifacts,
	representations,
});

export const createUploadingFileState = (
	{ id, details: { name, size, mediaType, mimeType, createdAt } }: ResponseFileItem,
	progress: number,
	binary?: Blob,
): UploadingFileState => ({
	status: 'uploading',
	progress,
	id,
	name,
	size,
	mediaType,
	mimeType,
	createdAt,
	preview: { value: binary || new Blob(['some-content'], { type: mimeType }) },
});

const defaultErrorFileStateError = createServerUnauthorizedError();

export const createErrorFileState = (
	{ id }: ResponseFileItem,
	error: CommonMediaClientError = defaultErrorFileStateError,
): ErrorFileState => fromCommonMediaClientError(id, undefined, error);
