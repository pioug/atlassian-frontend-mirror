import React from 'react';

import Button from '@atlaskit/button';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';

const ButtonIconBeforeExample = (): React.JSX.Element => {
	return (
		<Button iconBefore={<StarStarredIcon label="" />} appearance="primary">
			Icon before
		</Button>
	);
};

export default ButtonIconBeforeExample;
