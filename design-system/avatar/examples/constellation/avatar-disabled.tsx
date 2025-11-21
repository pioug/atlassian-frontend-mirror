import React from 'react';

import Avatar from '@atlaskit/avatar';

const AvatarDisabledExample = (): React.JSX.Element => {
	return (
		<Avatar
			src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
			name="Scott Farquhar"
			isDisabled
		/>
	);
};

export default AvatarDisabledExample;
