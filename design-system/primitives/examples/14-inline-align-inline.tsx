import React from 'react';

import { Box, Inline, Stack, xcss } from '../src';

const alignInlineItems = ['start', 'center', 'end'] as const;

const blockStyles = xcss({ borderRadius: 'border.radius.050' });

export default () => (
	<Box testId="inline-example" padding="space.100">
		<Inline space="space.100">
			{alignInlineItems.map((alignInline) => (
				<Stack key={alignInline} alignInline="center">
					{alignInline}
					<Box
						xcss={blockStyles}
						backgroundColor="color.background.neutral"
						padding="space.050"
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '200px',
						}}
					>
						<Inline alignInline={alignInline} space="space.050">
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
			))}
		</Inline>
	</Box>
);
