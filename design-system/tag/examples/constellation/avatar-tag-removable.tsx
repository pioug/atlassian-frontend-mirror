import React from 'react';

import Avatar from '@atlaskit/avatar';
import { AvatarTag } from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<AvatarTag
		text="Brian Lin"
		isRemovable={false}
		avatar={(props) => (
			<Avatar
				{...props}
				src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
				name="Brian Lin"
			/>
		)}
	/>
);
