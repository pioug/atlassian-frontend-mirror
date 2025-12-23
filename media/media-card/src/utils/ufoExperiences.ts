import { ConcurrentExperience, ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo';
import { type CardStatus } from '../types';
import { type FileAttributes, getFeatureFlagKeysAllProducts } from '@atlaskit/media-common';
import isValidId from 'uuid-validate';
import {
	extractErrorInfo,
	getRenderErrorRequestMetadata,
	type MediaCardErrorInfo,
	type SSRStatus,
} from './analytics';
import { MediaCardError } from '../errors';
import { getMediaEnvironment, getMediaRegion, type RequestMetadata } from '@atlaskit/media-client';
import { type FileStateFlags } from '../types';

type SucceedUfoPayload = {
	fileAttributes: FileAttributes;
	ssrReliability: SSRStatus;
	fileStateFlags: FileStateFlags;
};

type FailedUfoPayload = FailedProcessingPayload | ErrorUfoPayload;

type FailedProcessingPayload = {
	fileAttributes: FileAttributes;
	ssrReliability: SSRStatus;
	failReason: 'failed-processing';
	fileStateFlags: FileStateFlags;
};

type ErrorUfoPayload = {
	fileAttributes: FileAttributes;
	ssrReliability: SSRStatus;
	request: RequestMetadata | undefined;
	fileStateFlags: FileStateFlags;
} & MediaCardErrorInfo;

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const SAMPLE_RATE = 0.05;

let concurrentExperience: ConcurrentExperience | undefined;

const getExperience = (id: string) => {
	if (!concurrentExperience) {
		const inlineExperience = {
			platform: { component: 'media-card' },
			type: ExperienceTypes.Experience,
			performanceType: ExperiencePerformanceTypes.InlineResult,
			featureFlags: getFeatureFlagKeysAllProducts(),
		};
		concurrentExperience = new ConcurrentExperience('media-card-render', inlineExperience);
	}
	return concurrentExperience.getInstance(id);
};

export const shouldPerformanceBeSampled = () =>
	// We generate about 100M events UFOv1 events, we want to reduce this to about 5M as we can get the same info from there
	// Math.random() generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
	// The condition Math.random() < SAMPLE_RATE (0.05) will be true approximately 5% of the time.
	Math.random() < SAMPLE_RATE;

export const startUfoExperience = (id: string): void => {
	getExperience(id).start();
};

const sanitiseFileAttributes = (fileAttributes: FileAttributes) => {
	/*
		Allow external image mediaItemType as fileId
		See ExternalImageIdentifier interface on platform/packages/media/media-client/src/identifier.ts
	 */
	let sanitisedFileId = 'INVALID_FILE_ID';
	if (fileAttributes.fileId === 'external-image' || isValidId(fileAttributes.fileId)) {
		sanitisedFileId = fileAttributes.fileId;
	}

	return {
		...fileAttributes,
		fileId: sanitisedFileId,
	};
};

export const completeUfoExperience = (
	id: string,
	status: CardStatus,
	fileAttributes: FileAttributes,
	fileStateFlags: FileStateFlags,
	ssrReliability: SSRStatus,
	error: MediaCardError = new MediaCardError('missing-error-data'),
): void => {
	switch (status) {
		case 'complete':
			succeedUfoExperience(id, {
				fileAttributes,
				ssrReliability,
				fileStateFlags,
			});
			break;
		case 'failed-processing':
			failUfoExperience(id, {
				fileAttributes,
				failReason: 'failed-processing',
				ssrReliability,
				fileStateFlags,
			});
			break;
		case 'error':
			failUfoExperience(id, {
				fileAttributes,
				...extractErrorInfo(error),
				request: getRenderErrorRequestMetadata(error),
				ssrReliability,
				fileStateFlags,
			});
			break;
	}
};

const getBasePayloadAttributes = () => ({
	packageName,
	packageVersion,
	mediaEnvironment: getMediaEnvironment(),
	mediaRegion: getMediaRegion(),
});

const succeedUfoExperience = (id: string, properties?: SucceedUfoPayload) => {
	if (properties?.fileAttributes) {
		properties.fileAttributes = sanitiseFileAttributes(properties.fileAttributes);
	}
	getExperience(id).success({
		metadata: {
			...properties,
			...getBasePayloadAttributes(),
		},
	});
};

const failUfoExperience = (id: string, properties?: FailedUfoPayload) => {
	if (properties?.fileAttributes) {
		properties.fileAttributes = sanitiseFileAttributes(properties.fileAttributes);
	}
	getExperience(id).failure({
		metadata: {
			...properties,
			...getBasePayloadAttributes(),
		},
	});
};

export const abortUfoExperience = (id: string, properties?: Partial<SucceedUfoPayload>): void => {
	// UFO won't abort if it's already in a final state (succeeded, failed, aborted, etc)
	if (properties?.fileAttributes) {
		properties.fileAttributes = sanitiseFileAttributes(properties.fileAttributes);
	}
	getExperience(id).abort({
		metadata: {
			...properties,
			...getBasePayloadAttributes(),
		},
	});
};
