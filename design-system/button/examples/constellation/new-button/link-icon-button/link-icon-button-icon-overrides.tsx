import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import DiscoverIcon from '@atlaskit/icon/glyph/discover';
import { token } from '@atlaskit/tokens';

const LinkIconButtonOverridesExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			appearance="subtle"
			icon={(iconProps) => (
				<DiscoverIcon {...iconProps} primaryColor={token('color.icon.discovery')} />
			)}
			label="Learn about new features"
		/>
	);
};

export default LinkIconButtonOverridesExample;
