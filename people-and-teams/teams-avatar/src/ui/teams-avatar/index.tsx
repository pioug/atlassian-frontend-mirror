import React from 'react';

import Avatar, { AvatarContent, type AvatarPropTypes } from '@atlaskit/avatar';
import { fg } from '@atlaskit/platform-feature-flags';
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

export const ICON_BACKGROUND = token('color.icon.inverse');
export const ICON_COLOR = token('color.icon.subtle');

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

	if (fg('enable_teams_t26_design_drop_core_experiences')) {
		return (
			<Avatar {...props} appearance="square" size={size} testId={`${testId}-team-avatar`}>
				<AvatarContent>
					<TeamAvatarImage src={src} size={size} testId={testId} teamId={teamId} />
				</AvatarContent>
			</Avatar>
		);
	}

	return (
		<Avatar appearance="square" {...props} size={size} src={src} testId={`${testId}-team-avatar`}>
			<TeamAvatarImage src={src} size={size} testId={testId} teamId={teamId} compact={compact} />
		</Avatar>
	);
}
