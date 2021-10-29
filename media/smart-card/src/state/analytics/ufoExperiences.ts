import {
  ConcurrentExperience,
  CustomData,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';

type UfoExperienceName = 'smart-link-rendered' | 'smart-link-authenticated';
const ufoExperiences: Record<UfoExperienceName, ConcurrentExperience> = {
  'smart-link-rendered': new ConcurrentExperience('smart-link-rendered', {
    type: ExperienceTypes.Load,
    performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
    platform: { component: 'smart-links' },
  }),
  'smart-link-authenticated': new ConcurrentExperience(
    'smart-link-authenticated',
    {
      type: ExperienceTypes.Load,
      performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
      platform: { component: 'smart-links' },
    },
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
