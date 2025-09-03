import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({ display: 'flex' });
const blockStyles = xcss({ borderRadius: 'radius.xsmall' });

export default () => (
	<Box testId="inline-example" padding="space.100" xcss={containerStyles}>
		<Stack alignInline="center">
			space-between
			<Box
				xcss={blockStyles}
				padding="space.050"
				backgroundColor="color.background.neutral"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '200px',
				}}
			>
				<Inline space="space.200" spread="space-between">
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
				</Inline>
			</Box>
		</Stack>
	</Box>
);
