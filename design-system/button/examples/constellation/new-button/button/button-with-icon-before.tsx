import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../../../../src/new';

const ButtonIconBeforeExample = () => {
	return (
		<Button iconBefore={StarFilledIcon} appearance="primary">
			Icon before
		</Button>
	);
};

export default ButtonIconBeforeExample;
