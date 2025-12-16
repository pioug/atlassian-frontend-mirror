import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
	width: 'size.500',
	height: 'size.500',
});

export default function Basic(): React.JSX.Element {
	return (
		<Box
			backgroundColor="color.background.brand.bold"
			testId="box-basic"
			padding="space.100"
			as="ul"
			xcss={boxStyles}
		>
			<li></li>
		</Box>
	);
}
