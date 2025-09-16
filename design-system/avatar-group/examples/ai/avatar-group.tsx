import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';

export default [
	<AvatarGroup
		appearance="stack"
		size="large"
		onAvatarClick={console.log}
		data={[
			{ key: 'uid1', name: 'Bob Smith' },
			{ key: 'uid2', name: 'Alice Johnson' },
			{ key: 'uid3', name: 'Eve Brown' },
			{ key: 'uid4', name: 'Carol Davis' },
		]}
		maxCount={3}
	/>,
];
