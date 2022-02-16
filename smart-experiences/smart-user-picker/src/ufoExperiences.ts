import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  ConcurrentExperience,
} from '@atlaskit/ufo';
import { useEffect, useState } from 'react';

const COMPONENT_NAME = 'smart-user-picker';

export const smartUserPickerRenderedUfoExperience = new ConcurrentExperience(
  'smart-user-picker-rendered',
  {
    platform: { component: COMPONENT_NAME },
    type: ExperienceTypes.Load,
    performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
  },
);

export const useUFOConcurrentExperience = (
  experience: ConcurrentExperience,
  id: string,
) => {
  const experienceForId = experience.getInstance(id);

  // Equivalent to componentWillMount - replace with @atlaskit/ufo's
  // useUFOComponentExperience when it supports ConcurrentExperience.
  useState(() => {
    experienceForId.start();
  });

  // Replace with @atlaskit/ufo's <ExperienceSuccess> when it supports ConcurrentExperience
  useEffect(() => {
    experienceForId.success();
    return () => {
      experienceForId.abort();
    };

    // We only want this useEffect to run once after component mount, so no deps are needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
