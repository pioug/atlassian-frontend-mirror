import React from 'react';

import Badge from '@atlaskit/badge';
import { Stack, Text } from '@atlaskit/primitives/compiled';

const BadgeNewNeutralExample = (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Stack space="space.050" alignInline="center">
				<Badge appearance="neutral">{8}</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="neutral"
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="default">{8}</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="default"
				</Text>
			</Stack>
		</Stack>
	);
};

export default BadgeNewNeutralExample;
