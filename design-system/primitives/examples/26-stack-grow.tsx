import React from 'react';

import { Box, Inline, Stack, xcss } from '../src';

const growItems = ['hug', 'fill'] as const;

const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'border.radius.050',
	height: 'size.1000',
});

const blockStyles = xcss({ borderRadius: 'border.radius.050' });

export default () => (
	<Box testId="stack-example" padding="space.100">
		<Inline space="space.100">
			{growItems.map((grow) => (
				<Stack alignInline="center">
					{grow}
					<Box xcss={containerStyles} backgroundColor="color.background.neutral">
						<Stack grow={grow}>
							<Inline alignBlock="stretch" space="space.100" grow={grow}>
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
								<Box
									xcss={blockStyles}
									backgroundColor="color.background.discovery.bold"
									padding="space.200"
								/>
							</Inline>
						</Stack>
					</Box>
				</Stack>
			))}
		</Inline>
	</Box>
);
