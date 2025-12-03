import React from 'react';
import Avatar, { getAppearanceForAppType } from '@atlaskit/avatar';
import TeamAvatar from '@atlaskit/teams-avatar';
import { fg } from '@atlaskit/platform-feature-flags';

import { token } from '@atlaskit/tokens';
import { isTeamMention, type MentionDescription, type Presence } from '../../types';

type MentionAvatarProps = {
	mention: MentionDescription;
	selected?: boolean;
};
export const MentionAvatar = ({ mention, selected }: MentionAvatarProps): React.JSX.Element => {
	const { appType, avatarUrl, presence } = mention;
	const borderColor = selected ? token('color.border') : undefined;
	const { status } = presence || ({} as Presence);

	if (isTeamMention(mention)) {
		return <TeamAvatar src={avatarUrl} size="medium" borderColor={borderColor} />;
	}

	return (
		<Avatar
			src={avatarUrl}
			size="medium"
			presence={status}
			borderColor={borderColor}
			appearance={
				fg('jira_ai_agent_avatar_issue_view_comment_mentions')
					? getAppearanceForAppType(appType)
					: undefined
			}
		/>
	);
};
