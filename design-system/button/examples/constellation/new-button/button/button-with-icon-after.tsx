import React from 'react';

import Button from '@atlaskit/button/new';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

const ButtonIconAfterExample = () => {
	return (
		<Button iconAfter={StarFilledIcon} appearance="primary">
			Icon after
		</Button>
	);
};

export default ButtonIconAfterExample;
