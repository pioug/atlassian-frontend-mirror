import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const alignInlineItems = ['start', 'center', 'end'] as const;

const borderRadiusStyles = xcss({ borderRadius: 'radius.xsmall' });

export default () => (
	<Box testId="stack-example" padding="space.100">
		<Inline space="space.100">
			{alignInlineItems.map((alignInline) => (
				<Stack key={alignInline} alignInline="center">
					{alignInline}
					<Box
						xcss={borderRadiusStyles}
						backgroundColor="color.background.neutral"
						padding="space.050"
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '200px',
						}}
					>
						<Stack alignInline={alignInline} space="space.050">
							<Box
								xcss={borderRadiusStyles}
								padding="space.200"
								backgroundColor="color.background.discovery.bold"
							/>
							<Box
								xcss={borderRadiusStyles}
								padding="space.200"
								backgroundColor="color.background.discovery.bold"
							/>
							<Box
								xcss={borderRadiusStyles}
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
