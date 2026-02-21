import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Stack } from '@atlaskit/primitives/compiled';
import { AvatarTag } from '@atlaskit/tag';

const avatarUrl = 'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<AvatarTag
			type="user"
			text="Brian Lin with a very long name that will be truncated"
			avatar={(props: any) => <Avatar {...props} src={avatarUrl} name="Brian Lin" />}
		/>
		<AvatarTag
			type="user"
			text="Brian Lin with a very long name that will be truncated"
			avatar={(props: any) => <Avatar {...props} src={avatarUrl} name="Brian Lin" />}
			maxWidth="300px"
		/>
		<AvatarTag
			type="user"
			text="Brian Lin with a very long name that will be truncated"
			avatar={(props: any) => <Avatar {...props} src={avatarUrl} name="Brian Lin" />}
			maxWidth="80px"
		/>
	</Stack>
);
