import React from 'react';

import Button from '@atlaskit/button';
import StarStarredIcon from '@atlaskit/icon/core/migration/star-starred--star-filled';

const ButtonIconAfterExample = () => {
	return (
		<Button iconAfter={<StarStarredIcon label="" LEGACY_size="medium" />} appearance="primary">
			Icon after
		</Button>
	);
};

export default ButtonIconAfterExample;
