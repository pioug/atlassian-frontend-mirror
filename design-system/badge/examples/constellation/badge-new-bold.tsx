import React from 'react';

import Badge from '@atlaskit/badge';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';

const BadgeNewBoldExample = (): React.JSX.Element => {
	return (
		<Inline space="space.200" alignBlock="start">
			<Stack space="space.050" alignInline="center">
				<Badge appearance="informationBold">8</Badge>
				<Text size="small" color="color.text.subtlest">
					informationBold
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="successBold">8</Badge>
				<Text size="small" color="color.text.subtlest">
					successBold
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="dangerBold">8</Badge>
				<Text size="small" color="color.text.subtlest">
					dangerBold
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="warningBold">8</Badge>
				<Text size="small" color="color.text.subtlest">
					warningBold
				</Text>
			</Stack>
			<Stack space="space.050" alignInline="center">
				<Badge appearance="discoveryBold">8</Badge>
				<Text size="small" color="color.text.subtlest">
					discoveryBold
				</Text>
			</Stack>
		</Inline>
	);
};

export default BadgeNewBoldExample;
