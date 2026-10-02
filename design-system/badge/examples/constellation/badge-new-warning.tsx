import React from 'react';

import Badge from '@atlaskit/badge/badge';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

const BadgeNewWarningExample = (): React.JSX.Element => {
	return (
		<Stack space="space.050" alignInline="center">
			<Badge appearance="warning">{5}</Badge>
			<Text size="small" color="color.text.subtlest">
				appearance="warning"
			</Text>
		</Stack>
	);
};

export default BadgeNewWarningExample;
