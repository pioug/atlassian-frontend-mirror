import {
  ConcurrentExperience,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { CardStatus } from '../../src';
import { FileAttributes } from '@atlaskit/media-common';
import {
  extractErrorInfo,
  getRenderErrorRequestMetadata,
  MediaCardErrorInfo,
  SSRStatus,
} from './analytics';
import { MediaCardError } from '../errors';
import {
  getMediaEnvironment,
  getMediaRegion,
  RequestMetadata,
} from '@atlaskit/media-client';
import { FileStateFlags } from '../types';

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

let concurrentExperience: ConcurrentExperience | undefined;

const getExperience = (id: string, featureFlagsKeys: string[]) => {
  if (!concurrentExperience) {
    const inlineExperience = {
      platform: { component: 'media-card' },
      type: ExperienceTypes.Experience,
      performanceType: ExperiencePerformanceTypes.InlineResult,
      featureFlagsKeys,
    };
    concurrentExperience = new ConcurrentExperience(
      'media-card-render',
      inlineExperience,
    );
  }
  return concurrentExperience.getInstance(id);
};

export const startUfoExperience = (id: string, featureFlagsKeys: string[]) => {
  getExperience(id, featureFlagsKeys).start();
};

export const completeUfoExperience = (
  id: string,
  status: CardStatus,
  fileAttributes: FileAttributes,
  fileStateFlags: FileStateFlags,
  ssrReliability: SSRStatus,
  featureFlagsKeys: string[], // FeatureFlags are required when completing the experience to help assessing possible bugs if the experience was not started
  error?: MediaCardError,
) => {
  switch (status) {
    case 'complete':
      succeedUfoExperience(id, featureFlagsKeys, {
        fileAttributes,
        ssrReliability,
        fileStateFlags,
      });
      break;
    case 'failed-processing':
      failUfoExperience(id, featureFlagsKeys, {
        fileAttributes,
        failReason: 'failed-processing',
        ssrReliability,
        fileStateFlags,
      });
      break;
    case 'error':
      error &&
        failUfoExperience(id, featureFlagsKeys, {
          fileAttributes,
          ...extractErrorInfo(error),
          request: getRenderErrorRequestMetadata(error),
          ssrReliability,
          fileStateFlags,
        });
      break;
  }
};

const succeedUfoExperience = (
  id: string,
  featureFlagsKeys: string[],
  properties?: SucceedUfoPayload,
) => {
  getExperience(id, featureFlagsKeys).success({
    metadata: {
      ...properties,
      packageName,
      packageVersion,
      mediaEnvironment: getMediaEnvironment(),
      mediaRegion: getMediaRegion(),
    },
  });
};

const failUfoExperience = (
  id: string,
  featureFlagsKeys: string[],
  properties?: FailedUfoPayload,
) => {
  getExperience(id, featureFlagsKeys).failure({
    metadata: {
      ...properties,
      packageName,
      packageVersion,
      mediaEnvironment: getMediaEnvironment(),
      mediaRegion: getMediaRegion(),
    },
  });
};
