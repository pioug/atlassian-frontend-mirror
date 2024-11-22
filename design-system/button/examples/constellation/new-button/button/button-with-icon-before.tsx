import React from 'react';

import Button from '@atlaskit/button/new';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

const ButtonIconBeforeExample = () => {
	return (
		<Button iconBefore={StarFilledIcon} appearance="primary">
			Icon before
		</Button>
	);
};

export default ButtonIconBeforeExample;
