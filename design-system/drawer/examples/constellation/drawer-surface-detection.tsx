/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	content: {
		position: 'relative',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	header: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
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

const DrawerSurfaceDetectionExample = () => {
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
