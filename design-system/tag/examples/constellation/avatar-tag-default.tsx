import React from 'react';

import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

const avatarUrl =
	'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg';

export default (): React.JSX.Element => (
	<AvatarTag
		type="user"
		text="Brian Lin"
		avatar={(props: any) => <Avatar {...props} src={avatarUrl} name="Brian Lin" />}
	/>
);
