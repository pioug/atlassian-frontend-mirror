import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const growItems = ['hug', 'fill'] as const;

const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'radius.xsmall',
	height: 'size.1000',
});

const blockStyles = xcss({ borderRadius: 'radius.xsmall' });

export default (): React.JSX.Element => (
	<Box testId="stack-example" padding="space.100">
		<Inline space="space.100">
			{growItems.map((grow) => (
				<Stack key={grow} alignInline="center">
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
