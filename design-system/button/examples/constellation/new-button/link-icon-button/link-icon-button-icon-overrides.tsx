import React from 'react';

import DiscoverIcon from '@atlaskit/icon/glyph/discover';
import { token } from '@atlaskit/tokens';

import { LinkIconButton } from '../../../../src/new';

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
