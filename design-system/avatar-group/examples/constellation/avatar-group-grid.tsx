import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import { appearances } from '../../examples-util/appearances';
import { RANDOM_USERS } from '../../examples-util/random-users';

const styles = cssMap({
	container: { maxWidth: '200px' },
});

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	href: '#',
	appearance: appearances[i % appearances.length],
}));

const AvatarGroupGridExample = (): React.JSX.Element => (
	<Box xcss={styles.container}>
		<AvatarGroup appearance="grid" data={data} />
	</Box>
);

export default AvatarGroupGridExample;
