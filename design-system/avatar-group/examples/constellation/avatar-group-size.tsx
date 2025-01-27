import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';
import { Stack } from '@atlaskit/primitives/compiled';

import { getFreeToUseAvatarImage, RANDOM_USERS } from '../../examples-util/data';

const AvatarGroupSizeExample = () => {
	const data = RANDOM_USERS.slice(0, 8).map((d, i) => ({
		key: d.email,
		name: d.name,
		href: '#',
		src: getFreeToUseAvatarImage(i),
	}));

	return (
		<Stack space="space.100">
			<AvatarGroup data={data} size="small" />
			<AvatarGroup data={data} size="medium" />
			<AvatarGroup data={data} size="large" />
			<AvatarGroup data={data} size="xlarge" />
			<AvatarGroup data={data} size="xxlarge" />
		</Stack>
	);
};

export default AvatarGroupSizeExample;
