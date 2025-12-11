import React from 'react';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	maxWidth: 'size.1000',
});

const ButtonTruncationExample = (): React.JSX.Element => {
	return (
		<Box xcss={containerStyles}>
			<Button>This text is truncated to fit within the container</Button>
		</Box>
	);
};

export default ButtonTruncationExample;
