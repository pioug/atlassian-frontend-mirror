import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const blockStyles = xcss({ borderRadius: 'radius.xsmall' });
const flexStyles = xcss({ display: 'flex' });
const containerStyles = xcss({
	display: 'flex',
	borderRadius: 'radius.xsmall',
	height: '200px',
});

export default (): React.JSX.Element => (
	<Box testId="stack-example" padding="space.100" xcss={flexStyles}>
		<Stack alignInline="center">
			space-between
			<Box xcss={containerStyles} padding="space.050" backgroundColor="color.background.neutral">
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
