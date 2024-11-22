import React from 'react';

import Button from '@atlaskit/button';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

const ButtonWithIconOnlyExample = () => {
	return (
		<Button
			iconAfter={<StarFilledIcon label="" size="medium" />}
			appearance="primary"
			aria-label="Unstar this page"
		/>
	);
};

export default ButtonWithIconOnlyExample;
