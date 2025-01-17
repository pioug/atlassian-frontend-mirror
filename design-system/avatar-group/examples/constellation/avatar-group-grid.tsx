import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';
import { Box, xcss } from '@atlaskit/primitives';

import { getFreeToUseAvatarImage, RANDOM_USERS } from '../../examples-util/data';

const containerStyles = xcss({
	maxWidth: '200px',
});

const AvatarGroupGridExample = () => {
	const data = RANDOM_USERS.map((d, i) => ({
		key: d.email,
		name: d.name,
		href: '#',
		src: getFreeToUseAvatarImage(i),
	}));

	return (
		<Box xcss={containerStyles}>
			<AvatarGroup appearance="grid" data={data} />
		</Box>
	);
};

export default AvatarGroupGridExample;
