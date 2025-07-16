import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const alignBlockItems = ['start', 'center', 'end', 'stretch'] as const;

const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'border.radius.050',
});
const blockStyles = xcss({ borderRadius: 'border.radius.050' });

export default () => (
	<Box testId="stack-example" padding="space.100">
		<Inline space="space.200">
			{alignBlockItems.map((alignBlock) => (
				<Stack key={alignBlock} alignInline="center">
					{alignBlock}
					<Box
						backgroundColor="color.background.neutral"
						padding="space.050"
						xcss={containerStyles}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: '200px',
						}}
					>
						<Stack space="space.050" alignBlock={alignBlock}>
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
			))}
		</Inline>
	</Box>
);
