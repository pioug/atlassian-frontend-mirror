import {
  UFOExperience,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';

import { FileAttributes } from '@atlaskit/media-common';
import { RequestMetadata } from '@atlaskit/media-client';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import { PrimaryErrorReason } from '../errors';

export type UFOFailedEventPayload = {
  failReason?: PrimaryErrorReason;
  error?: string;
  errorDetail?: string;
  request?: RequestMetadata;
  fileAttributes: FileAttributes;
};

let ufoExperience: UFOExperience | undefined;

const getExperience = () => {
  if (!ufoExperience) {
    const inlineExperience = {
      platform: { component: 'media-viewer' },
      type: ExperienceTypes.Experience,
      performanceType: ExperiencePerformanceTypes.InlineResult,
    };
    ufoExperience = new UFOExperience('media-file', inlineExperience);
  }
  return ufoExperience;
};

export const startMediaFileUfoExperience = () => {
  getExperience().start();
};

export const succeedMediaFileUfoExperience = (properties?: FileAttributes) => {
  getExperience().success({
    metadata: { fileAttributes: properties, packageName, packageVersion },
  });
};

export const failMediaFileUfoExperience = (
  properties?: UFOFailedEventPayload,
) => {
  const refinedMetadata = {
    ...properties,
    packageName,
    packageVersion,
  };
  getExperience().failure({ metadata: refinedMetadata });
};
