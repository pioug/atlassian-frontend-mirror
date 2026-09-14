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

import { Lorem } from '../lorem';

const styles = cssMap({
	content: {
		position: 'relative',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	header: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		position: 'absolute',
		backgroundColor: token('utility.elevation.surface.current'),
		borderBlockEndColor: token('color.border'),
		borderBlockEndStyle: 'solid',
		borderBlockEndWidth: token('border.width'),
		boxShadow: token('elevation.shadow.overflow'),
		insetBlockStart: token('space.0'),
		insetInlineEnd: token('space.0'),
		insetInlineStart: token('space.0'),
	},
});

const DrawerSurfaceDetectionExample: () => JSX.Element = () => {
	const [open, setOpen] = useState(false);

	return (
		<Fragment>
			<Drawer onClose={() => setOpen(false)} isOpen={open} label="Surface detection">
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<div css={styles.content}>
						<div css={styles.header}>
							<h2>Header overlay</h2>
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
