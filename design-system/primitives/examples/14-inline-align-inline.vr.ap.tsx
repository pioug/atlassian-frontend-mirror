import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const alignInlineItems = ['start', 'center', 'end'] as const;

const blockStyles = xcss({ borderRadius: 'radius.xsmall' });
const containerStyles = xcss({ borderRadius: 'radius.xsmall', width: '200px' });

export default (): React.JSX.Element => (
	<Box testId="inline-example" padding="space.100">
		<Inline space="space.100">
			{alignInlineItems.map((alignInline) => (
				<Stack key={alignInline} alignInline="center">
					{alignInline}
					<Box
						xcss={containerStyles}
						backgroundColor="color.background.neutral"
						padding="space.050"
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
