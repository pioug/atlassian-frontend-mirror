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
import { RequestMetadata } from '@atlaskit/media-client';

type SucceedUfoPayload = {
  fileAttributes: FileAttributes;
  ssrReliability: SSRStatus;
};

type FailedUfoPayload = FailedProcessingPayload | ErrorUfoPayload;

type FailedProcessingPayload = {
  fileAttributes: FileAttributes;
  ssrReliability: SSRStatus;
  failReason: 'failed-processing';
};

type ErrorUfoPayload = {
  fileAttributes: FileAttributes;
  ssrReliability: SSRStatus;
  request: RequestMetadata | undefined;
} & MediaCardErrorInfo;

let concurrentExperience: ConcurrentExperience | undefined;

const getExperience = (id: string) => {
  if (!concurrentExperience) {
    const inlineExperience = {
      platform: { component: 'media-card' },
      type: ExperienceTypes.Experience,
      performanceType: ExperiencePerformanceTypes.InlineResult,
    };
    concurrentExperience = new ConcurrentExperience(
      'media-card-render',
      inlineExperience,
    );
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
  ssrReliability: SSRStatus,
  error?: MediaCardError,
) => {
  switch (status) {
    case 'complete':
      succeedUfoExperience(id, {
        fileAttributes,
        ssrReliability,
      });
      break;
    case 'failed-processing':
      failUfoExperience(id, {
        fileAttributes,
        failReason: 'failed-processing',
        ssrReliability,
      });
      break;
    case 'error':
      error &&
        failUfoExperience(id, {
          fileAttributes,
          ...extractErrorInfo(error),
          request: getRenderErrorRequestMetadata(error),
          ssrReliability,
        });
      break;
  }
};

const succeedUfoExperience = (id: string, properties?: SucceedUfoPayload) => {
  getExperience(id).success({
    metadata: {
      ...properties,
      packageName,
      packageVersion,
    },
  });
};

const failUfoExperience = (id: string, properties?: FailedUfoPayload) => {
  getExperience(id).failure({
    metadata: { ...properties, packageName, packageVersion },
  });
};
