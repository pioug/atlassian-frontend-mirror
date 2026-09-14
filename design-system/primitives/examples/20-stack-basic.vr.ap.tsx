import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const containerStyles = xcss({ display: 'flex' });
const blockStyles = xcss({ borderRadius: 'radius.xsmall' });

export default (): React.JSX.Element => (
	<Box testId="stack-example" padding="space.100" xcss={containerStyles}>
		<Stack>
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
		</Stack>
	</Box>
);
