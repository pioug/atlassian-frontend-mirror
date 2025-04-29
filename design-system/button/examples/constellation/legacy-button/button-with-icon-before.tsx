import React from 'react';

import Button from '@atlaskit/button';
import StarStarredIcon from '@atlaskit/icon/core/migration/star-starred--star-filled';

const ButtonIconBeforeExample = () => {
	return (
		<Button iconBefore={<StarStarredIcon label="" LEGACY_size="medium" />} appearance="primary">
			Icon before
		</Button>
	);
};

export default ButtonIconBeforeExample;
