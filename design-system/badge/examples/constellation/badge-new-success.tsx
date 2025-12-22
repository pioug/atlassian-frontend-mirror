import React from 'react';

import Badge from '@atlaskit/badge';
import { Stack, Text } from '@atlaskit/primitives/compiled';

const BadgeNewSuccessExample = (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Stack space="space.050" alignInline="center">
				<Badge appearance="success">+100</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="success"
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="added">+100</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="added"
				</Text>
			</Stack>
		</Stack>
	);
};

export default BadgeNewSuccessExample;
