import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const alignBlockItems = ['start', 'center', 'end', 'stretch'] as const;

const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'radius.xsmall',
	height: '200px',
});
const blockStyles = xcss({ borderRadius: 'radius.xsmall' });

export default (): React.JSX.Element => (
	<Box testId="stack-example" padding="space.100">
		<Inline space="space.200">
			{alignBlockItems.map((alignBlock) => (
				<Stack key={alignBlock} alignInline="center">
					{alignBlock}
					<Box
						backgroundColor="color.background.neutral"
						padding="space.050"
						xcss={containerStyles}
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
