import React from 'react';

import Button from '@atlaskit/button/default/button';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

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
