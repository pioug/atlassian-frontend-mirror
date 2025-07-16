import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';

const solidBorderStyles = xcss({ borderStyle: 'solid' });

export default () => {
	return (
		<Stack space="space.400" alignInline="start">
			<Heading size="medium">Custom width</Heading>
			<Stack space="space.200" testId="box-custom-width">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Box xcss={solidBorderStyles} style={{ width: '600px' }}>
					custom width
				</Box>
			</Stack>

			<Stack space="space.200" testId="box-custom-padding">
				<Heading size="medium">Custom padding</Heading>
				<Box
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ paddingLeft: '14px' }}
					backgroundColor="color.background.discovery.bold"
				>
					<Box backgroundColor="elevation.surface">custom padding</Box>
				</Box>
			</Stack>
		</Stack>
	);
};
