import React from 'react';

import { LinkIconButton, type LinkIconButtonProps } from '@atlaskit/button/new';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

const tooltipOptions: LinkIconButtonProps['tooltip'] = {
	position: 'right',
	hideTooltipOnClick: true,
};

const LinkIconButtonTooltipOptionsExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={UserIcon}
			label="View profile"
			isTooltipDisabled={false}
			tooltip={tooltipOptions}
		/>
	);
};

export default LinkIconButtonTooltipOptionsExample;
