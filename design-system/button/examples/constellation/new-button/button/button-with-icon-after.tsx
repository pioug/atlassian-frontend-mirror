import React from 'react';

import Button from '@atlaskit/button/default/button';
import StarIcon from '@atlaskit/icon/core/star-starred';

export default function ButtonIconAfterExample(): React.JSX.Element {
	return (
		<Button iconAfter={StarIcon} appearance="primary">
			Icon after
		</Button>
	);
}
