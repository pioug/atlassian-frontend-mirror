import {
  UFOExperience,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';

import { type FileAttributes } from '@atlaskit/media-common';
import {
  getMediaEnvironment,
  getMediaRegion,
  type RequestMetadata,
} from '@atlaskit/media-client';
import { getFeatureFlagKeysAllProducts } from '@atlaskit/media-common';

import { type PrimaryErrorReason } from '../errors';
import { type FileStateFlags } from '../components/types';

export type UFOFailedEventPayload = {
  failReason?: PrimaryErrorReason;
  error?: string;
  errorDetail?: string;
  request?: RequestMetadata;
  fileAttributes: FileAttributes;
  fileStateFlags?: FileStateFlags;
};

export type UFOSucceedEventPayload = {
  fileAttributes: FileAttributes;
  fileStateFlags?: FileStateFlags;
};

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

let ufoExperience: UFOExperience | undefined;

const getExperience = () => {
  if (!ufoExperience) {
    const inlineExperience = {
      platform: { component: 'media-viewer' },
      type: ExperienceTypes.Experience,
      performanceType: ExperiencePerformanceTypes.InlineResult,
      featureFlags: getFeatureFlagKeysAllProducts(),
    };
    ufoExperience = new UFOExperience('media-file', inlineExperience);
  }
  return ufoExperience;
};

export const startMediaFileUfoExperience = () => {
  getExperience().start();
};

export const succeedMediaFileUfoExperience = (
  properties?: UFOSucceedEventPayload,
) => {
  getExperience().success({
    metadata: {
      ...properties,
      packageName,
      packageVersion,
      mediaEnvironment: getMediaEnvironment(),
      mediaRegion: getMediaRegion(),
    },
  });
};

export const failMediaFileUfoExperience = (
  properties?: UFOFailedEventPayload,
) => {
  const refinedMetadata = {
    ...properties,
    packageName,
    packageVersion,
    mediaEnvironment: getMediaEnvironment(),
    mediaRegion: getMediaRegion(),
  };
  getExperience().failure({ metadata: refinedMetadata });
};
