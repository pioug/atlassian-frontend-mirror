import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../../../../src/new';

const ButtonIconAfterExample = () => {
	return (
		<Button iconAfter={StarFilledIcon} appearance="primary">
			Icon after
		</Button>
	);
};

export default ButtonIconAfterExample;
