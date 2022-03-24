import React from 'react';
import { UFOExperience } from '@atlaskit/ufo';

export class UfoErrorBoundary extends React.Component<{
  experiences: UFOExperience[];
}> {
  componentDidCatch() {
    for (const e of this.props.experiences) {
      e.failure();
    }
  }

  render() {
    return this.props.children;
  }
}
