import React from 'react';

import { token } from '@atlaskit/tokens';

import { LINK_PICKER_WIDTH_IN_PX } from '../../common/constants';

import { ErrorBoundaryFallback } from './error-boundary-fallback';

const createExample = (): React.ComponentType => {
  return function Example() {
    return (
      <div
        style={{
          border: '1px solid red',
          width: `${LINK_PICKER_WIDTH_IN_PX}px`,
          ['--link-picker-padding-left' as string]: token('space.200', '16px'),
          ['--link-picker-padding-right' as string]: token('space.200', '16px'),
          ['--link-picker-padding-top' as string]: token('space.200', '16px'),
          ['--link-picker-padding-bottom' as string]: token(
            'space.200',
            '16px',
          ),
        }}
      >
        <ErrorBoundaryFallback />
      </div>
    );
  };
};

export const ErrorBoundary = createExample();
