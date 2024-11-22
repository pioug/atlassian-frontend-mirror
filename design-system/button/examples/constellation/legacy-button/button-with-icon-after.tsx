import React from 'react';

import Button from '@atlaskit/button';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

const ButtonIconAfterExample = () => {
	return (
		<Button iconAfter={<StarFilledIcon label="" size="medium" />} appearance="primary">
			Icon after
		</Button>
	);
};

export default ButtonIconAfterExample;
