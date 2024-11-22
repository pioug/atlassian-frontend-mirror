import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { token } from '@atlaskit/tokens';

const IconButtonSmallExample = () => {
	return (
		<IconButton
			icon={(iconProps) => (
				<StarFilledIcon
					{...iconProps}
					size="small"
					primaryColor={token('color.icon.accent.orange')}
				/>
			)}
			label="Add to favorites"
		/>
	);
};

export default IconButtonSmallExample;
