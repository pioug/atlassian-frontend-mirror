import React from 'react';

import Heading from '@atlaskit/heading/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const customWidthStyles = xcss({ borderStyle: 'solid', width: '600px' });

const CustomPaddingBox = ({
	paddingLeft,
	children,
}: {
	paddingLeft: React.CSSProperties['paddingLeft'];
	children: React.ReactNode;
}) => (
	<Box style={{ paddingLeft }} backgroundColor="color.background.discovery.bold">
		{children}
	</Box>
);

export default (): React.JSX.Element => {
	return (
		<Stack space="space.400" alignInline="start">
			<Heading size="medium">Custom width</Heading>
			<Stack space="space.200" testId="box-custom-width">
				<Box xcss={customWidthStyles}>custom width</Box>
			</Stack>

			<Stack space="space.200" testId="box-custom-padding">
				<Heading size="medium">Custom padding</Heading>
				<CustomPaddingBox paddingLeft="14px">
					<Box backgroundColor="elevation.surface">custom padding</Box>
				</CustomPaddingBox>
			</Stack>
		</Stack>
	);
};
