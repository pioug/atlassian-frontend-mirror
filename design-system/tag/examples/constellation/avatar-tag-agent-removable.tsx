import React from 'react';

import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

const agentAvatarUrl = 'https://dummyimage.com/48x48/6554c0/ffffff&text=AI';

export default (): React.JSX.Element => (
	<AvatarTag
		type="agent"
		text="Rovo Agent"
		isRemovable={false}
		avatar={(props: any) => <Avatar {...props} src={agentAvatarUrl} name="Rovo Agent" />}
	/>
);
