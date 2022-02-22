import React from 'react';

import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  ConcurrentExperience,
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
    userPickerRenderedUfoExperience.getInstance(this.props.id).failure();
  }

  render() {
    return this.props.children;
  }
}
