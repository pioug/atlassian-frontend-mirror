/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import Inline from '@atlaskit/primitives/inline';

const overlayStyles = css({
  top: 0,
  right: 0,
  bottom: 0,
  left: 32,
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
    <Inline space="300" alignBlock="center">
      {children}
    </Inline>
  </Box>
);
