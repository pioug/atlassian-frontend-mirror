import React from 'react';

import TeamsAvatar from '@atlaskit/teams-avatar';

import { useHydratedTeam } from '../../../../state';
import { type NodeViewProps } from '../../util/react-node-view';
import { type JQLNodeSpec } from '../types';

import { AvatarWrapper, NameContainer, TeamContainer } from './styled';

export type Props = {
	fieldName: string;
	id: string;
	name: string;
};

const Team = ({ id, name, fieldName, selected, error }: NodeViewProps<Props>) => {
	const [team] = useHydratedTeam({
		id,
		fieldName,
	});

	return (
		<TeamContainer selected={selected} error={error}>
			<AvatarWrapper data-testid="team-avatar-wrapper">
				<TeamsAvatar
					teamId={id}
					src={team?.avatarUrl}
					borderColor="transparent"
					size="xsmall"
					compact={true}
				/>
			</AvatarWrapper>
			<NameContainer>{name}</NameContainer>
		</TeamContainer>
	);
};

export const team: JQLNodeSpec<Props> = {
	component: Team,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
