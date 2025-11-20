import React from 'react';

import Avatar, { type AvatarPropTypes } from '@atlaskit/avatar';
import { N0, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { TeamAvatarImage } from './teams-avatar-image';

/*
 * The component accepts src and teamId as input params. Order of preference:
 * If src is provided, use that directly.
 * Else if teamId is provided, use that to generate the static image URL.
 * Else fallback.
 */
export type TeamAvatarProps = Omit<AvatarPropTypes, 'appearance'> & {
	teamId?: string;
	compact?: boolean;
};

export const ICON_BACKGROUND = token('color.icon.inverse', N0);
export const ICON_COLOR = token('color.icon.subtle', N90);

export default function TeamAvatar({
	testId,
	src,
	size = 'medium',
	teamId = '',
	compact = false,
	...props
}: TeamAvatarProps): React.JSX.Element {
	// Strip ARI in case the teamId was given in that format
	teamId = teamId.replace('ari:cloud:identity::team/', '');
	return (
		<Avatar appearance="square" {...props} size={size} src={src} testId={`${testId}-team-avatar`}>
			<TeamAvatarImage src={src} size={size} testId={testId} teamId={teamId} compact={compact} />
		</Avatar>
	);
}
