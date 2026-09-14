import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import getAppearanceForAppType from '@atlaskit/avatar/get-appearance';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import TeamAvatar from '@atlaskit/teams-avatar/teams-avatar';
import { token } from '@atlaskit/tokens';

import { isAppMention } from '../../is-app-mention';
import { isTeamMention } from '../../is-team-mention';
import type { MentionDescription, Presence } from '../../types';

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

	// Agent providers can request GraphQL `identityAccount { picture }` and pass it as
	// `avatarUrl`; this component only applies the hexagon agent shape.
	const shouldRenderAgentMentionAvatar =
		isAppMention(mention) &&
		mention.appType === 'agent' &&
		isExperimentEnabled('rovo_chat_mention_agents');

	const avatarAppearance = shouldRenderAgentMentionAvatar
		? 'hexagon'
		: fg('jira_ai_agent_avatar_issue_view_comment_mentions')
			? getAppearanceForAppType(appType)
			: undefined;

	return (
		<Avatar
			src={avatarUrl}
			size="medium"
			presence={status}
			borderColor={borderColor}
			appearance={avatarAppearance}
		/>
	);
};
