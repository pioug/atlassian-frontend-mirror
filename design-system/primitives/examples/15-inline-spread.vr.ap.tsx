import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const containerStyles = xcss({ display: 'flex' });
const blockStyles = xcss({ borderRadius: 'radius.xsmall' });
const fixedWidthBlockStyles = xcss({ borderRadius: 'radius.xsmall', width: '200px' });

export default (): React.JSX.Element => (
	<Box testId="inline-example" padding="space.100" xcss={containerStyles}>
		<Stack alignInline="center">
			space-between
			<Box
				xcss={fixedWidthBlockStyles}
				padding="space.050"
				backgroundColor="color.background.neutral"
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
