import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

const LinkIconButtonTooltipExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={UserIcon}
			label="View profile"
			isTooltipDisabled={false}
		/>
	);
};

export default LinkIconButtonTooltipExample;
