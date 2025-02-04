import React from 'react';

import Avatar, { type AvatarPropTypes } from '@atlaskit/avatar';
import { N0, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { TeamAvatarImage } from './teams-avatar-image';
import { isSquareIcon } from './utils';

export type TeamAvatarProps = Omit<AvatarPropTypes, 'appearance'>;

export const ICON_BACKGROUND = token('color.icon.inverse', N0);
export const ICON_COLOR = token('color.icon.subtle', N90);

export default function TeamAvatar({ testId, src, size = 'medium', ...props }: TeamAvatarProps) {
	return (
		<Avatar
			appearance={isSquareIcon(src) ? 'square' : 'circle'}
			{...props}
			size={size}
			src={src}
			testId={`${testId}-team-avatar`}
		>
			{(innerProps) => <TeamAvatarImage src={src} size={size} testId={testId} {...innerProps} />}
		</Avatar>
	);
}
