import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';

import { getFreeToUseAvatarImage, RANDOM_USERS } from '../../examples-util/data';

const AvatarGroupBorderColorExample = () => {
	const data = RANDOM_USERS.map((d, i) => ({
		key: d.email,
		name: d.name,
		href: '#',
		src: getFreeToUseAvatarImage(i),
	}));

	return <AvatarGroup data={data} borderColor="#FF6347" />;
};

export default AvatarGroupBorderColorExample;
