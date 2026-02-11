/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	content: {
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
		position: 'relative',
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	header: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		backgroundColor: token('utility.elevation.surface.current'),
	},
});

const DrawerSurfaceDetectionExample: () => JSX.Element = () => {
	const [open, setOpen] = useState<boolean>(true);

	return (
		<Fragment>
			<Drawer onClose={() => setOpen(false)} isOpen={open} label="Surface detection">
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<div css={styles.content}>
						<div css={styles.header}>
							<h2>Current surface</h2>
						</div>
						<Lorem count={2} />
					</div>
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				Open drawer
			</Button>
		</Fragment>
	);
};

export default DrawerSurfaceDetectionExample;
