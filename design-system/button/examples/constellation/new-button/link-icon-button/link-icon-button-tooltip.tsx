import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';

const LinkIconButtonTooltipExample = (): React.JSX.Element => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={PersonAvatarIcon}
			label="View profile"
			isTooltipDisabled={false}
		/>
	);
};

export default LinkIconButtonTooltipExample;
