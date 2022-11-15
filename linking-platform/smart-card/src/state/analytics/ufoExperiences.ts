import {
  ConcurrentExperience,
  CustomData,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';

type UfoExperienceName =
  | 'smart-link-rendered'
  | 'smart-link-authenticated'
  | 'smart-link-action-invocation';

const inlineExperience = {
  platform: { component: 'smart-links' },
  type: ExperienceTypes.Experience,
  performanceType: ExperiencePerformanceTypes.InlineResult,
};

const renderExperience = {
  platform: { component: 'smart-links' },
  type: ExperienceTypes.Load,
  performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
};

const ufoExperiences: Record<UfoExperienceName, ConcurrentExperience> = {
  'smart-link-rendered': new ConcurrentExperience(
    'smart-link-rendered',
    renderExperience,
  ),
  'smart-link-authenticated': new ConcurrentExperience(
    'smart-link-authenticated',
    inlineExperience,
  ),
  'smart-link-action-invocation': new ConcurrentExperience(
    'smart-link-action-invocation',
    inlineExperience,
  ),
};

export const startUfoExperience = (
  experienceName: UfoExperienceName,
  id: string,
  properties?: CustomData,
) => {
  const experience = ufoExperiences[experienceName].getInstance(id);
  experience.start();
  if (properties) {
    experience.addMetadata(properties);
  }
};

export const succeedUfoExperience = (
  experienceName: UfoExperienceName,
  id: string,
  properties?: CustomData,
) => {
  const experience = ufoExperiences[experienceName].getInstance(id);
  experience.success({ metadata: properties });
};

export const failUfoExperience = (
  experienceName: UfoExperienceName,
  id: string,
  properties?: CustomData,
) => {
  const experience = ufoExperiences[experienceName].getInstance(id);
  experience.failure({ metadata: properties });
};

export const addMetadataToExperience = (
  experienceName: UfoExperienceName,
  id: string,
  properties: CustomData,
) => {
  ufoExperiences[experienceName].getInstance(id).addMetadata(properties);
};
