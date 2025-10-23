import React from 'react';

import Avatar from '@atlaskit/avatar';

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
			<AvatarWrapper>
				<Avatar src={team?.avatarUrl} borderColor="transparent" size="xsmall" />
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
