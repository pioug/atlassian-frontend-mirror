import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import TeamsAvatar from '@atlaskit/teams-avatar/teams-avatar';

import { useHydratedTeam } from '../../../../state';
import { type NodeViewProps } from '../../util/react-node-view';

import { AvatarWrapper, NameContainer, TeamContainer } from './styled';
import type { Props } from './types';

/**
 * Team ids are written into JQL with an `id:` prefix so the parser can tell them apart from team
 * display names (e.g. `descendantsOfTeam(id:<uuid>)`). The prefix is not part of the id itself, so it
 * has to be removed before the id is used to build an avatar URL.
 */
const TEAM_ID_PREFIX_REGEX = /^id:\s*/i;

/**
 * TeamNode Component
 *
 * This component renders a pill-like view for the Team node type in the JQL editor.
 */
export const TeamNode = ({
	id,
	name,
	fieldName,
	selected,
	error,
}: NodeViewProps<Props>): React.JSX.Element => {
	const [team] = useHydratedTeam({
		id,
		fieldName,
	});

	const teamId = fg('jira-descendants-of-team-jql-function')
		? id.replace(TEAM_ID_PREFIX_REGEX, '')
		: id;

	return (
		<TeamContainer selected={selected} error={error}>
			<AvatarWrapper data-testid="team-avatar-wrapper">
				<TeamsAvatar
					teamId={teamId}
					src={team?.avatarUrl}
					borderColor="transparent"
					size="xxsmall"
					compact={true}
				/>
			</AvatarWrapper>
			<NameContainer>{name}</NameContainer>
		</TeamContainer>
	);
};
