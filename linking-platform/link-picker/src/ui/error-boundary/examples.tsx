import React from 'react';

import { LINK_PICKER_WIDTH_IN_PX } from '../../common/constants';

import { ErrorBoundaryFallback } from './error-boundary-fallback';

const createExample = (): React.ComponentType => {
  return function Example() {
    return (
      <div
        style={{
          border: '1px solid red',
          width: `${LINK_PICKER_WIDTH_IN_PX}px`,
        }}
      >
        <ErrorBoundaryFallback />
      </div>
    );
  };
};

export const ErrorBoundary = createExample();
