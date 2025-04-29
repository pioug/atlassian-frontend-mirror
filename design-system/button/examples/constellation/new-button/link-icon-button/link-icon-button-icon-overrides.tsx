import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import CompassIcon from '@atlaskit/icon/core/migration/compass--discover';
import { token } from '@atlaskit/tokens';

const LinkIconButtonOverridesExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			appearance="subtle"
			icon={(iconProps) => (
				<CompassIcon
					{...iconProps}
					LEGACY_primaryColor={token('color.icon.discovery')}
					color={token('color.icon.discovery')}
				/>
			)}
			label="Learn about new features"
		/>
	);
};

export default LinkIconButtonOverridesExample;
