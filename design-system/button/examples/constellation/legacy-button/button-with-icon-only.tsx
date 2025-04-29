import React from 'react';

import Button from '@atlaskit/button';
import StarStarredIcon from '@atlaskit/icon/core/migration/star-starred--star-filled';

const ButtonWithIconOnlyExample = () => {
	return (
		<Button
			iconAfter={<StarStarredIcon label="" LEGACY_size="medium" spacing="spacious" />}
			appearance="primary"
			aria-label="Unstar this page"
		/>
	);
};

export default ButtonWithIconOnlyExample;
