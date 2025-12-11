import React from 'react';

import Button from '@atlaskit/button';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';

const ButtonWithIconOnlyExample = (): React.JSX.Element => {
	return (
		<Button
			iconAfter={<StarStarredIcon label="" spacing="spacious" />}
			appearance="primary"
			aria-label="Unstar this page"
		/>
	);
};

export default ButtonWithIconOnlyExample;
