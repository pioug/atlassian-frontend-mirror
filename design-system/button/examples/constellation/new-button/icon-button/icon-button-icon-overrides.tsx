import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import { token } from '@atlaskit/tokens';

const IconButtonIconOverridesExample = () => {
	return (
		<IconButton
			icon={(iconProps) => (
				<StarStarredIcon {...iconProps} color={token('color.icon.accent.orange')} />
			)}
			label="Add to favorites"
		/>
	);
};

export default IconButtonIconOverridesExample;
