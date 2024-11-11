import React from 'react';

import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const alignBlockItems = ['start', 'center', 'end', 'baseline', 'stretch', undefined] as const;

const blockStyles = xcss({ borderRadius: 'border.radius.050' });
const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'border.radius.050',
	height: 'size.1000',
});

export default () => (
	<Box testId="inline-example" padding="space.100">
		<Inline space="space.200">
			{alignBlockItems.map((alignBlock) => (
				<Stack key={alignBlock} alignInline="center" space="space.025">
					{alignBlock ?? '(default)'}
					<Box
						backgroundColor="color.background.neutral"
						padding="space.050"
						xcss={containerStyles}
					>
						<Inline space="space.050" alignBlock={alignBlock}>
							<Box
								xcss={blockStyles}
								padding="space.300"
								backgroundColor="color.background.discovery.bold"
							></Box>
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
			))}
		</Inline>
	</Box>
);
