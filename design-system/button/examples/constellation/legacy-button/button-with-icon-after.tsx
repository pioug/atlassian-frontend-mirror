import React from 'react';

import Button from '@atlaskit/button';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';

const ButtonIconAfterExample = (): React.JSX.Element => {
	return (
		<Button iconAfter={<StarStarredIcon label="" />} appearance="primary">
			Icon after
		</Button>
	);
};

export default ButtonIconAfterExample;
