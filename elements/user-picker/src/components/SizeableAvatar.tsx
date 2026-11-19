import React from 'react';

import Avatar, { type AvatarPropTypes } from '@atlaskit/avatar/avatar';
import type { AppearanceType } from '@atlaskit/avatar/types';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
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

		if (type === 'team') {
			return <TeamAvatar {...props} />;
		}

		return avatarAppearanceShape === 'hexagon' &&
			expVal('platform_user_picker_agent_avatar_hexagon', 'isEnabled', false) ? (
			<Avatar {...props} appearance="hexagon" hasInnerBorder />
		) : (
			<Avatar {...props} />
		);
	}
}
