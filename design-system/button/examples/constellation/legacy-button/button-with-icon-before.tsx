import React from 'react';

import Button from '@atlaskit/button';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

const ButtonIconBeforeExample = () => {
	return (
		<Button iconBefore={<StarFilledIcon label="" size="medium" />} appearance="primary">
			Icon before
		</Button>
	);
};

export default ButtonIconBeforeExample;
