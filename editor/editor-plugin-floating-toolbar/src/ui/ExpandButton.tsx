import React from 'react';

import Icon from '@atlaskit/icon/core/chevron-right';
import { Box } from '@atlaskit/primitives/compiled';

export function ExpandButton() {
	return (
		<Box paddingInline="space.075">
			<Icon label={'Edit'} size="small" />
		</Box>
	);
}
