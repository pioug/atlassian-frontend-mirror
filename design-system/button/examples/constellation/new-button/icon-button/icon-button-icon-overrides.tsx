import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import StarStarredIcon from '@atlaskit/icon/core/migration/star-starred--star-filled';
import { token } from '@atlaskit/tokens';

const IconButtonIconOverridesExample = () => {
	return (
		<IconButton
			icon={(iconProps) => (
				<StarStarredIcon
					{...iconProps}
					LEGACY_primaryColor={token('color.icon.accent.orange')}
					color={token('color.icon.accent.orange')}
				/>
			)}
			label="Add to favorites"
		/>
	);
};

export default IconButtonIconOverridesExample;
