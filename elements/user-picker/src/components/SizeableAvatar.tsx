import React from 'react';

import Avatar, { type AvatarPropTypes } from '@atlaskit/avatar/avatar';
import type { AppearanceType } from '@atlaskit/avatar/types';
import TeamAvatar from '@atlaskit/teams-avatar/teams-avatar';

import { getAvatarSize } from './getAvatarSize';

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
