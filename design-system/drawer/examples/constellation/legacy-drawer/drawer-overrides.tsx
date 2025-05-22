import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer';
import { Box, xcss } from '@atlaskit/primitives';

const sidebarOverrideStyles = xcss({
	display: 'flex',
	width: '64px',
	height: '100vh',
	paddingBlockStart: 'space.300',
	paddingBlockEnd: 'space.200',
	alignItems: 'center',
	flexBasis: 'auto',
	flexDirection: 'column',
	backgroundColor: 'color.background.accent.yellow.subtlest',
	color: 'color.text.accent.yellow.bolder',
});

const contentOverrideStyles = xcss({
	padding: 'space.300',
	flex: 1,
	backgroundColor: 'color.background.accent.blue.subtlest',
	color: 'color.text.accent.blue.bolder',
	overflow: 'auto',
});

const DrawerOverridesExample = () => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<Fragment>
			<Drawer
				label="Drawer with custom overrides"
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/design-system/no-deprecated-apis
				overrides={{
					Sidebar: {
						component: ({ children }) => <Box xcss={sidebarOverrideStyles}>{children} Sidebar</Box>,
					},
					Content: {
						component: ({ children }) => <Box xcss={contentOverrideStyles}>{children} Content</Box>,
					},
				}}
				onClose={() => setOpen(false)}
				isOpen={open}
			/>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				Open drawer with overrides
			</Button>
		</Fragment>
	);
};

export default DrawerOverridesExample;
