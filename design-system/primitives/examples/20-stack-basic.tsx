import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({ display: 'flex' });
const blockStyles = xcss({ borderRadius: 'border.radius.050' });

export default () => (
	<Box testId="stack-example" padding="space.100" xcss={containerStyles}>
		<Stack>
			<Box
				xcss={blockStyles}
				backgroundColor="color.background.discovery.bold"
				padding="space.200"
			/>
			<Box
				xcss={blockStyles}
				backgroundColor="color.background.discovery.bold"
				padding="space.200"
			/>
		</Stack>
	</Box>
);
