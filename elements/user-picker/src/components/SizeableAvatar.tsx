import Avatar, { type AvatarPropTypes, type AppearanceType } from '@atlaskit/avatar';
import TeamAvatar from '@atlaskit/teams-avatar';
import React from 'react';
import { getAvatarSize } from './utils';

export type Props = {
	appearance: string;
	avatarAppearanceShape?: AppearanceType;
	presence?: string;
	src?: string;
	type?: 'person' | 'team';
};

export class SizeableAvatar extends React.PureComponent<Props> {
	render() {
		const { src, presence, appearance, type = 'person', avatarAppearanceShape } = this.props;

		const props: AvatarPropTypes = {
			size: getAvatarSize(appearance),
			src,
			borderColor: 'transparent',
			presence,
			...(avatarAppearanceShape && { appearance: avatarAppearanceShape }),
		};

		return type === 'team' ? <TeamAvatar {...props} /> : <Avatar {...props} />;
	}
}
