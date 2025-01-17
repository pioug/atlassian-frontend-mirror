import React from 'react';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';

import { RANDOM_USERS } from '../examples-util/data';

const Example = () => {
	const data = RANDOM_USERS.slice(0, 8).map((d) => ({
		key: d.email,
		name: d.name,
		appearance: 'circle' as AppearanceType,
		size: 'medium' as SizeType,
	}));

	return (
		<AvatarGroup
			testId="overrides"
			appearance="stack"
			data={data}
			size="large"
			onAvatarClick={undefined}
		/>
	);
};

export default Example;
