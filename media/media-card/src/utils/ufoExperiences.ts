import { ConcurrentExperience, ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo';
import { type CardStatus } from '../types';
import { type FileAttributes, getFeatureFlagKeysAllProducts } from '@atlaskit/media-common';
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

export const startUfoExperience = (id: string) => {
	getExperience(id).start();
};

export const completeUfoExperience = (
	id: string,
	status: CardStatus,
	fileAttributes: FileAttributes,
	fileStateFlags: FileStateFlags,
	ssrReliability: SSRStatus,
	error: MediaCardError = new MediaCardError('missing-error-data'),
) => {
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
	getExperience(id).success({
		metadata: {
			...properties,
			...getBasePayloadAttributes(),
		},
	});
};

const failUfoExperience = (id: string, properties?: FailedUfoPayload) => {
	getExperience(id).failure({
		metadata: {
			...properties,
			...getBasePayloadAttributes(),
		},
	});
};

export const abortUfoExperience = (id: string, properties?: Partial<SucceedUfoPayload>) => {
	// UFO won't abort if it's already in a final state (succeeded, failed, aborted, etc)
	getExperience(id).abort({
		metadata: {
			...properties,
			...getBasePayloadAttributes(),
		},
	});
};
