/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

const avatarSectionStyles = css({
  gridArea: 'avatar-area',
});

interface AvatarSlotProps {
  /**
   * The element to display as the Comment avatar - generally an Atlaskit Avatar
   */
  children?: ReactNode;
}

/**
 * __Avatar slot is used to nest an avatar in a comment__
 *
 * The avatar slot is used to nest an avatar in a comment's layout.
 *
 */
const AvatarSlot: FC<AvatarSlotProps> = ({ children }) => (
  <Box display="block" css={avatarSectionStyles}>
    {children}
  </Box>
);

export default AvatarSlot;
