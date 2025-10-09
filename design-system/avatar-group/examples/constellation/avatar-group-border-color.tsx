import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';

import { appearances, getFreeToUseAvatarImage, RANDOM_USERS } from '../../examples-util/data';

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	href: '#',
	appearance: appearances[i % appearances.length],
	src: getFreeToUseAvatarImage(i),
}));

const AvatarGroupBorderColorExample = () => <AvatarGroup data={data} borderColor="#FF6347" />;

export default AvatarGroupBorderColorExample;
