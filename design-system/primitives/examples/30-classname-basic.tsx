import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({ display: 'flex', flexDirection: 'row' });

const boxStyles = xcss({
	backgroundColor: 'color.background.danger',
	border: '2px solid rebeccapurple',
	padding: 'space.200',
	borderRadius: 'radius.xsmall',
});

const defaultStyles = xcss({
	backgroundColor: 'color.background.success',
	border: '2px solid green',
	borderRadius: 'radius.xsmall',
	opacity: 'opacity.disabled',
});

export default () => (
	<Box xcss={containerStyles} padding="space.100">
		<Inline space="space.100" testId="classname-examples">
			<Box backgroundColor="color.background.discovery.bold" padding="space.200" xcss={boxStyles} />
			<Box
				backgroundColor="color.background.discovery.bold"
				padding="space.200"
				xcss={defaultStyles}
			/>
		</Inline>
	</Box>
);
