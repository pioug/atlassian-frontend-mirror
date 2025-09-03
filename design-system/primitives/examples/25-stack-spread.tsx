import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';

const blockStyles = xcss({ borderRadius: 'radius.xsmall' });
const flexStyles = xcss({ display: 'flex' });
const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'radius.xsmall',
});

export default () => (
	<Box testId="stack-example" padding="space.100" xcss={flexStyles}>
		<Stack alignInline="center">
			space-between
			<Box
				xcss={containerStyles}
				padding="space.050"
				backgroundColor="color.background.neutral"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ height: '200px' }}
			>
				<Stack space="space.200" spread="space-between">
					<Box
						xcss={blockStyles}
						padding="space.200"
						backgroundColor="color.background.discovery.bold"
					/>
					<Box
						xcss={blockStyles}
						padding="space.200"
						backgroundColor="color.background.discovery.bold"
					/>
					<Box
						xcss={blockStyles}
						padding="space.200"
						backgroundColor="color.background.discovery.bold"
					/>
				</Stack>
			</Box>
		</Stack>
	</Box>
);
