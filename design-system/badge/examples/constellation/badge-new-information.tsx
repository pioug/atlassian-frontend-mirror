import React from 'react';

import Badge from '@atlaskit/badge';
import { Stack, Text } from '@atlaskit/primitives/compiled';

const BadgeNewInformationExample = (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Stack space="space.050" alignInline="center">
				<Badge appearance="information">{12}</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="information"
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="primary">{12}</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="primary"
				</Text>
			</Stack>
		</Stack>
	);
};

export default BadgeNewInformationExample;
