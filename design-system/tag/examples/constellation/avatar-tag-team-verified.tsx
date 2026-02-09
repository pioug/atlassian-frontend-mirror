import React from 'react';

import { AvatarTag } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';

export default (): React.JSX.Element => (
	<AvatarTag
		type="other"
		text="Atlassian"
		isVerified
		avatar={(props: any) => <TeamAvatar {...props} name="Atlassian" />}
	/>
);
