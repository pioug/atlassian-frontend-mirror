import React from 'react';

import Badge from '@atlaskit/badge';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const wrapperStyles = xcss({
	backgroundColor: 'color.background.accent.red.subtlest',
	display: 'flex',
	blockSize: 'size.600',
	inlineSize: 'size.600',
	padding: 'space.100',
});

const smallContainerStyles = xcss({
	display: 'flex',
	width: '20px',
	backgroundColor: 'color.background.accent.lime.subtlest',
	height: '50px',
});

export default (): React.JSX.Element => {
	return (
		<React.StrictMode>
			<Stack space="space.200">
				<Box xcss={wrapperStyles}>
					<Inline alignBlock="stretch" alignInline="center" grow="fill">
						{/* this Badge should not stretch vertically */}
						<Badge appearance="primary">{77}</Badge>
					</Inline>
				</Box>

				<Box xcss={smallContainerStyles}>
					{/* this Badge should not break onto multiple lines */}
					<Badge>x55</Badge>
				</Box>
			</Stack>
		</React.StrictMode>
	);
};
