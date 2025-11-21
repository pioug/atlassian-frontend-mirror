import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';

import { appearances, getFreeToUseAvatarImage, RANDOM_USERS } from '../../examples-util/data';

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	href: '#',
	src: getFreeToUseAvatarImage(i),
	appearance: appearances[i % appearances.length],
}));

const AvatarGroupStackExample = (): React.JSX.Element => (
	<AvatarGroup appearance="stack" data={data} />
);

export default AvatarGroupStackExample;
