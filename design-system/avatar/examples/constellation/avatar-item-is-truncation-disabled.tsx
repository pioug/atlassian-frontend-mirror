import React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

const AvatarItemIsTruncationDisabled = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ maxWidth: 120, border: `${token('border.width')} solid pink` }}>
			<AvatarItem
				avatar={
					<Avatar
						src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
						name="Scott Farquhar"
					/>
				}
				primaryText="Scott"
				secondaryText="scott@atlassian.com"
				isTruncationDisabled={true}
			/>
			<AvatarItem
				avatar={
					<Avatar
						src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
						name="Scott Farquhar"
					/>
				}
				primaryText="Scott"
				secondaryText="Scott@atlassian.com"
				isTruncationDisabled={false}
			/>
		</div>
	);
};

export default AvatarItemIsTruncationDisabled;
