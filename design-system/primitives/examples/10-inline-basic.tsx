import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';

const blockStyles = xcss({ borderRadius: 'radius.xsmall' });

export default (): React.JSX.Element => (
	<Box testId="inline-example" padding="space.100">
		<Inline>
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
	</Box>
);
