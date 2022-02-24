import React from 'react';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  ConcurrentExperience,
  UFOExperienceState,
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

export const smartUserPickerOptionsShownUfoExperience = new ConcurrentExperience(
  'smart-user-picker-options-shown',
  {
    platform: { component: COMPONENT_NAME },
    type: ExperienceTypes.Operation,
    performanceType: ExperiencePerformanceTypes.InlineResult,
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
    if (experienceForId.state !== UFOExperienceState['FAILED']) {
      experienceForId.success();
    }
    return () => {
      if (
        [
          UFOExperienceState['STARTED'],
          UFOExperienceState['IN_PROGRESS'],
        ].includes(experienceForId.state)
      ) {
        experienceForId.abort();
      }
    };

    // We only want this useEffect to run once after component mount, so no deps are needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export class UfoErrorBoundary extends React.Component<{ id: string }> {
  componentDidCatch() {
    smartUserPickerRenderedUfoExperience.getInstance(this.props.id).failure();
  }

  render() {
    return this.props.children;
  }
}
