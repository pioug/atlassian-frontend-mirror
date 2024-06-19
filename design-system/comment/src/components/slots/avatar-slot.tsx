/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const avatarSectionStyles = xcss({
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
	<Box xcss={avatarSectionStyles}>{children}</Box>
);

export default AvatarSlot;
