import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';
import { Stack } from '@atlaskit/primitives/compiled';

import { appearances, RANDOM_USERS } from '../../examples-util/data';

const data = RANDOM_USERS.slice(0, 8).map((d, i) => ({
	key: d.email,
	name: d.name,
	href: '#',
	appearance: appearances[i % appearances.length],
}));

const AvatarGroupSizeExample = (): React.JSX.Element => (
	<Stack space="space.100">
		<AvatarGroup data={data} size="small" />
		<AvatarGroup data={data} size="medium" />
		<AvatarGroup data={data} size="large" />
		<AvatarGroup data={data} size="xlarge" />
		<AvatarGroup data={data} size="xxlarge" />
	</Stack>
);

export default AvatarGroupSizeExample;
