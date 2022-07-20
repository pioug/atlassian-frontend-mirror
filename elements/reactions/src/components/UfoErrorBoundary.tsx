import React, { ErrorInfo } from 'react';
import { UFOExperience } from '@atlaskit/ufo';
import { WithSamplingUFOExperience } from '@atlaskit/emoji';

export class UfoErrorBoundary extends React.Component<{
  experiences: UFOExperience[] | WithSamplingUFOExperience[];
}> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    for (const exp of this.props.experiences) {
      exp.failure({
        metadata: {
          source: 'UfoErrorBoundary',
          reason: 'error',
          error: {
            name: error.name,
            message: error.message,
            infoStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  render() {
    return this.props.children;
  }
}
