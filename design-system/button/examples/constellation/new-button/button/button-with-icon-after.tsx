import React from 'react';

import Button from '@atlaskit/button/new';
import StarIcon from '@atlaskit/icon/core/star-starred';

export default function ButtonIconAfterExample() {
	return (
		<Button iconAfter={StarIcon} appearance="primary">
			Icon after
		</Button>
	);
}
