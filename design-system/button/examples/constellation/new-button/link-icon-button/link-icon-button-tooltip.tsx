import React from 'react';

import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

import { LinkIconButton } from '../../../../src/new';

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
