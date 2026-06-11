import React from 'react';

import Avatar from '@atlaskit/avatar';

import { useHydratedLozengeWithAvatar } from '../../../../state';
import { type NodeViewProps } from '../../util/react-node-view';
import { type JQLNodeSpec } from '../types';

import { AvatarWrapper, LozengeWithAvatarContainer, NameContainer } from './styled';

export type Props = {
	fieldName: string;
	id: string;
	name: string;
};

const LozengeWithAvatar = ({ id, name, fieldName, selected, error }: NodeViewProps<Props>) => {
	const [lozengeWithAvatar] = useHydratedLozengeWithAvatar({
		id,
		fieldName,
	});

	return (
		<LozengeWithAvatarContainer selected={selected} error={error}>
			<AvatarWrapper>
				<Avatar src={lozengeWithAvatar?.avatarUrl} borderColor="transparent" size="xsmall" />
			</AvatarWrapper>
			<NameContainer>{name}</NameContainer>
		</LozengeWithAvatarContainer>
	);
};

export const lozengeWithAvatar: JQLNodeSpec<Props> = {
	component: LozengeWithAvatar,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
