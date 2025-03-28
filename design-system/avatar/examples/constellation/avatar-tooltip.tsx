import React from 'react';

import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';

const AvatarTooltipExample = () => {
	const presence = 'online';
	const name = 'Mike Cannon-Brookes';
	const label = `${name} (${presence})`;
	return (
		<Tooltip content={label}>
			<Avatar
				name={name}
				src="https://pbs.twimg.com/profile_images/568401563538841600/2eTVtXXO_400x400.jpeg"
				size="large"
				onClick={console.log}
				presence={presence}
			/>
		</Tooltip>
	);
};

export default AvatarTooltipExample;
