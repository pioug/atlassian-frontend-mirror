import React from 'react';

import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  ConcurrentExperience,
  UFOExperienceState,
} from '@atlaskit/ufo';

export const userPickerRenderedUfoExperience = new ConcurrentExperience(
  'user-picker-rendered',
  {
    platform: { component: 'user-picker' },
    type: ExperienceTypes.Load,
    performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
  },
);

export const userPickerOptionsShownUfoExperience = new ConcurrentExperience(
  'user-picker-options-shown',
  {
    platform: { component: 'user-picker' },
    type: ExperienceTypes.Operation,
    performanceType: ExperiencePerformanceTypes.InlineResult,
  },
);

export class UfoErrorBoundary extends React.Component<
  React.PropsWithChildren<{ id: string }>
> {
  componentDidCatch() {
    const instance = userPickerRenderedUfoExperience.getInstance(this.props.id);
    if (instance.state.id !== UFOExperienceState.FAILED.id) {
      instance.failure();
    }
  }

  render() {
    return this.props.children;
  }
}
