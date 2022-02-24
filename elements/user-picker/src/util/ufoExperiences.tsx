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

export class UfoErrorBoundary extends React.Component<{ id: string }> {
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
