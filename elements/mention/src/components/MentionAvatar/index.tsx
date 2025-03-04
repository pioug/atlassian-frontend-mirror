import React from 'react';
import Avatar from '@atlaskit/avatar';
import TeamAvatar from '@atlaskit/teams-avatar';

import { token } from '@atlaskit/tokens';
import { isTeamMention, type MentionDescription, type Presence } from '../../types';

type MentionAvatarProps = {
	selected?: boolean;
	mention: MentionDescription;
};
export const MentionAvatar = ({ mention, selected }: MentionAvatarProps) => {
	const { avatarUrl, presence } = mention;
	const borderColor = selected ? token('color.border') : undefined;
	const { status } = presence || ({} as Presence);

	if (isTeamMention(mention)) {
		return <TeamAvatar src={avatarUrl} size="medium" borderColor={borderColor} />;
	}

	return <Avatar src={avatarUrl} size="medium" presence={status} borderColor={borderColor} />;
};
