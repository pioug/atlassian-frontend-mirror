import React from 'react';
import Avatar from '@atlaskit/avatar';
import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack, Text } from '@atlaskit/primitives';

import { type User } from '../../types';
import * as Styled from './styles';

interface Props {
	user: User;
}

export class UserInfo extends React.Component<Props> {
	render(): React.JSX.Element {
		const { user } = this.props;
		return (
			<Styled.UserInfoOuter>
				<Styled.Avatar>
					<Avatar size="large" src={user.avatarUrl} />
				</Styled.Avatar>
				<Stack space="space.050">
					<Heading size="small" as="span">
						{user.fullName}
					</Heading>
					<Text size="small" color="color.text.subtlest">
						{user.email}
					</Text>
				</Stack>
			</Styled.UserInfoOuter>
		);
	}
}

export default UserInfo;
