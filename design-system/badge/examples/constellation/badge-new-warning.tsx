import React from 'react';

import Badge from '@atlaskit/badge';
import { Stack, Text } from '@atlaskit/primitives/compiled';

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
