import React from 'react';

import Icon from '@atlaskit/icon/utility/chevron-right';
import { Box } from '@atlaskit/primitives';

export function ExpandButton() {
	return (
		<Box paddingInline="space.075">
			<Icon label={'Edit'} />
		</Box>
	);
}
