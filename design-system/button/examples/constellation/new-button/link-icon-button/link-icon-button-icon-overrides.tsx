import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import CompassIcon from '@atlaskit/icon/core/compass';
import { token } from '@atlaskit/tokens';

const LinkIconButtonOverridesExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			appearance="subtle"
			icon={(iconProps) => <CompassIcon {...iconProps} color={token('color.icon.discovery')} />}
			label="Learn about new features"
		/>
	);
};

export default LinkIconButtonOverridesExample;
