import React from 'react';

import { AvatarTag } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';

export default (): React.JSX.Element => (
	<AvatarTag
		type="other"
		text="Design System Team"
		href="https://atlassian.design"
		avatar={(props: any) => <TeamAvatar {...props} name="Design System Team" />}
	/>
);
