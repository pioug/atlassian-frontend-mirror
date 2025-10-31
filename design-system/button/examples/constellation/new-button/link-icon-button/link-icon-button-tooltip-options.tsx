import React from 'react';

import { LinkIconButton, type LinkIconButtonProps } from '@atlaskit/button/new';
import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';

const tooltipOptions: LinkIconButtonProps['tooltip'] = {
	position: 'right',
	hideTooltipOnClick: true,
};

const LinkIconButtonTooltipOptionsExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={PersonAvatarIcon}
			label="View profile"
			isTooltipDisabled={false}
			tooltip={tooltipOptions}
		/>
	);
};

export default LinkIconButtonTooltipOptionsExample;
