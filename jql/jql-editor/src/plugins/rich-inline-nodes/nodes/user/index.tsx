import React from 'react';

import Avatar from '@atlaskit/avatar';

import { useHydratedUser } from '../../../../state';
import { type NodeViewProps } from '../../util/react-node-view';
import { type JQLNodeSpec } from '../types';

import { AvatarWrapper, NameContainer, UserContainer } from './styled';

export type Props = {
	id: string;
	name: string;
	fieldName: string;
};

const User = ({ id, name, fieldName, selected, error }: NodeViewProps<Props>) => {
	const [user] = useHydratedUser({
		id,
		fieldName,
	});

	return (
		<UserContainer selected={selected} error={error}>
			<AvatarWrapper>
				<Avatar src={user?.avatarUrl} borderColor="transparent" size="xsmall" />
			</AvatarWrapper>
			<NameContainer>{name}</NameContainer>
		</UserContainer>
	);
};

export const user: JQLNodeSpec<Props> = {
	component: User,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
