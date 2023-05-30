/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const InlineDialogFormWrapper: React.FC = ({ children }) => (
  <div
    css={{
      width: `${8 * 44}px`,
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
      padding: `${token('space.200', '16px')} ${token('space.300', '24px')}`,
    }}
  >
    {children}
  </div>
);
