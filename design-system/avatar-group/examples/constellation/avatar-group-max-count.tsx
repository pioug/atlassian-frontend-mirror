import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { getFreeToUseAvatarImage, RANDOM_USERS } from '../../examples-util/data';
import AvatarGroup from '../../src';

const containerStyles = xcss({
	maxWidth: '200px',
});

const AvatarGroupMaxCountExample = () => {
	const data = RANDOM_USERS.map((d, i) => ({
		key: d.email,
		name: d.name,
		href: '#',
		src: getFreeToUseAvatarImage(i),
	}));

	return (
		<Box xcss={containerStyles}>
			<AvatarGroup appearance="grid" maxCount={14} data={data} />
		</Box>
	);
};

export default AvatarGroupMaxCountExample;
