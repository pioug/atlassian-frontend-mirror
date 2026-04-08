import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';

import { appearances } from '../../examples-util/appearances';
import { RANDOM_USERS } from '../../examples-util/random-users';

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	href: '#',
	appearance: appearances[i % appearances.length],
}));

const AvatarGroupStackExample = (): React.JSX.Element => (
	<AvatarGroup appearance="stack" data={data} />
);

export default AvatarGroupStackExample;
