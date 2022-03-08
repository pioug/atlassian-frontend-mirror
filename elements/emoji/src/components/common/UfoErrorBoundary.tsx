import React from 'react';
import { UFOExperience } from '@atlaskit/ufo';

export class UfoErrorBoundary extends React.Component<{
  experiences: UFOExperience[];
}> {
  componentDidCatch() {
    this.props.experiences.forEach((e) => e.failure());
  }

  render() {
    return this.props.children;
  }
}
