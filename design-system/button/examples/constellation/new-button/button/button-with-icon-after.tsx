import React from 'react';

import Button from '@atlaskit/button/new';
import StarStarredIcon from '@atlaskit/icon/core/migration/star-starred--star-filled';

const ButtonIconAfterExample = () => {
	return (
		<Button iconAfter={StarStarredIcon} appearance="primary">
			Icon after
		</Button>
	);
};

export default ButtonIconAfterExample;
