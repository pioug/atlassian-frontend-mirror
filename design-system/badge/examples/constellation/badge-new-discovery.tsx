import React from 'react';

import Badge from '@atlaskit/badge/badge';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

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
