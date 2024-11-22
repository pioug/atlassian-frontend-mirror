import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { token } from '@atlaskit/tokens';

const IconButtonSmallExample = () => {
	return (
		<IconButton
			appearance="subtle"
			icon={(iconProps) => (
				<StarFilledIcon {...iconProps} primaryColor={token('color.icon.warning')} />
			)}
			label="Add to favorites"
		/>
	);
};

export default IconButtonSmallExample;
