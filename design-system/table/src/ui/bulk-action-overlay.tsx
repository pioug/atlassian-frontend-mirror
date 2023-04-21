/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import Inline from '@atlaskit/primitives/inline';
import { token } from '@atlaskit/tokens';

const overlayStyles = css({
  inset: 0,
  left: token('space.400', '32px'),
});

/**
 * __Bulk action overlay__
 *
 * A bulk action overlay is used to conditionally render when a user makes a row selection
 */
export const BulkActionOverlay: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <Box
    as="th"
    position="absolute"
    paddingInline="space.100"
    backgroundColor="elevation.surface"
    css={overlayStyles}
  >
    <Inline space="space.300" alignBlock="center">
      {children}
    </Inline>
  </Box>
);
