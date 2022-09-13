/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

export const InlineDialogFormWrapper: React.FC = ({ children }) => (
  <div
    css={{
      width: `${gridSize() * 44}px`,
    }}
  >
    {children}
  </div>
);

/**
 * Apply the same styling, as previous @atlaskit/inline-dialog had,
 * compared to the @atlaskit/popup we are now using.
 *
 * packages/design-system/inline-dialog/src/InlineDialog/styled.ts:20:3
 */
export const InlineDialogContentWrapper: React.FC = ({ children }) => (
  <div
    css={{
      padding: `${gridSize() * 2}px ${gridSize() * 3}px`,
    }}
  >
    {children}
  </div>
);
