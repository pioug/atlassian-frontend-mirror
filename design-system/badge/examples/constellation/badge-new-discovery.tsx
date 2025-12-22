import React from 'react';

import Badge from '@atlaskit/badge';
import { Stack, Text } from '@atlaskit/primitives/compiled';

const BadgeNewDiscoveryExample = (): React.JSX.Element => {
	return (
		<Stack space="space.050" alignInline="center">
			<Badge appearance="discovery">{3}</Badge>
			<Text size="small" color="color.text.subtlest">
				appearance="discovery"
			</Text>
		</Stack>
	);
};

export default BadgeNewDiscoveryExample;
