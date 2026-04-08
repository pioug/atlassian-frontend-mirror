import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';

import { appearances } from '../examples-util/appearances';
import { RANDOM_USERS } from '../examples-util/random-users';

const data = RANDOM_USERS.slice(0, 8).map((d, i) => ({
	key: d.email,
	name: d.name,
	appearance: appearances[i % appearances.length],
}));

const Example = (): React.JSX.Element => {
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
