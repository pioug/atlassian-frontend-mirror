import React from 'react';

import Badge from '@atlaskit/badge';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

const BadgeNewInverseExample = (): React.JSX.Element => {
	return (
		<Box backgroundColor="color.background.brand.bold" padding="space.200">
			<Stack space="space.100">
				<Stack space="space.050" alignInline="center">
					<Badge appearance="inverse">{12}</Badge>
					<Text size="small" color="color.text.inverse">
						appearance="inverse"
					</Text>
				</Stack>
				<Stack space="space.050" alignInline="center">
					<Badge appearance="primaryInverted">{12}</Badge>
					<Text size="small" color="color.text.inverse">
						appearance="primaryInverted"
					</Text>
				</Stack>
			</Stack>
		</Box>
	);
};

export default BadgeNewInverseExample;
