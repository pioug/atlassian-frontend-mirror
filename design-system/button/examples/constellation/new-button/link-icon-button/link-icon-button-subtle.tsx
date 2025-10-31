import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import SettingsIcon from '@atlaskit/icon/core/settings';

const LinkIconButtonSubtleExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			appearance="subtle"
			icon={SettingsIcon}
			label="View settings"
		/>
	);
};

export default LinkIconButtonSubtleExample;
