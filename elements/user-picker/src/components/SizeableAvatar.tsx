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
	render(): React.JSX.Element {
		const { src, presence, appearance, type = 'person', avatarAppearanceShape } = this.props;

		// `getAvatarSize` only ever returns 'xsmall' | 'small' | 'medium', none of
		// which is the team-avatar-unsupported `UNSAFE_xsmall` (20px) size. Keeping
		// `size` narrowed here lets the object satisfy both Avatar and TeamAvatar.
		const size = getAvatarSize(appearance);
		const props: Omit<AvatarPropTypes, 'size'> & { size: typeof size } = {
			size,
			src,
			borderColor: 'transparent',
			presence,
			...(avatarAppearanceShape && { appearance: avatarAppearanceShape }),
		};

		return type === 'team' ? <TeamAvatar {...props} /> : <Avatar {...props} />;
	}
}
