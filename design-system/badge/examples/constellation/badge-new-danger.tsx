import React from 'react';

import Badge from '@atlaskit/badge/badge';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

const BadgeNewDangerExample = (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Stack space="space.050" alignInline="center">
				<Badge appearance="danger">-50</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="danger"
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="removed">-50</Badge>
				<Text size="small" color="color.text.subtlest">
					appearance="removed"
				</Text>
			</Stack>
		</Stack>
	);
};

export default BadgeNewDangerExample;
