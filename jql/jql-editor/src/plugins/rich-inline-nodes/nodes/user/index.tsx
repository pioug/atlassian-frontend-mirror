import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import getAppearanceForAppType from '@atlaskit/avatar/get-appearance';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useHydratedUser } from '../../../../state';
import { type NodeViewProps } from '../../util/react-node-view';
import { type JQLNodeSpec } from '../types';
import { AvatarWrapper, NameContainer, UserContainer } from './styled';

export type Props = {
	fieldName: string;
	id: string;
	name: string;
};

const User = ({ id, name, fieldName, selected, error }: NodeViewProps<Props>) => {
	const [user] = useHydratedUser({
		id,
		fieldName,
	});

	return (
		<UserContainer selected={selected} error={error}>
			<AvatarWrapper>
				<Avatar
					src={user?.avatarUrl}
					borderColor="transparent"
					size="xxsmall"
					appearance={
						fg('jira_ai_agent_avatar_with_apptype_for_jql')
							? getAppearanceForAppType(user?.appType ?? null)
							: undefined
					}
				/>
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
