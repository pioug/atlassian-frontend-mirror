/** @jsx jsx */

import { PropsWithChildren } from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const InlineDialogFormWrapper = ({
  children,
}: PropsWithChildren<{}>) => (
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
export const InlineDialogContentWrapper = ({
  children,
  label,
}: PropsWithChildren<{ label?: string }>) => (
  <div
    css={{
      padding: `${token('space.200', '16px')} ${token('space.300', '24px')}`,
    }}
    aria-label={label}
  >
    {children}
  </div>
);
