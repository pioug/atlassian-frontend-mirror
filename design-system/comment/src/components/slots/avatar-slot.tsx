import React, { type FC, type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const avatarSectionStyles = cssMap({
	root: {
		gridArea: 'avatar-area',
	},
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
	<Box xcss={avatarSectionStyles.root}>{children}</Box>
);

export default AvatarSlot;
