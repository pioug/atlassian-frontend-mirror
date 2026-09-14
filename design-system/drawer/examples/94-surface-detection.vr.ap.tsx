/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { token } from '@atlaskit/tokens';

import { Lorem } from './lorem';

const styles = cssMap({
	content: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		position: 'relative',
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	header: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
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
