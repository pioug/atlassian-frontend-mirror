/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
	},
	background: {
		position: 'fixed',
		zIndex: '1',
		paddingTop: token('space.300', '24px'),
		paddingRight: token('space.300', '24px'),
		paddingBottom: token('space.300', '24px'),
		paddingLeft: token('space.300', '24px'),
		backgroundColor: token('color.background.neutral'),
		border: `1px solid ${token('color.background.accent.gray.subtle')}`,
	},
});

export default function DrawerExample() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);

	return (
		<div css={styles.root}>
			<Drawer
				onClose={() => setIsDrawerOpen(false)}
				isOpen={isDrawerOpen}
				width="wide"
				testId="drawer"
				label="Drawer focus trap"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<code>Content</code>
				</DrawerContent>
			</Drawer>
			<div css={styles.background}>
				<p>
					This area should appear behind the blanket from the drawer, including during the blanket
					fade-in animation that creates a new stacking context
				</p>
				<Button
					id="open-drawer"
					type="button"
					onClick={() => setIsDrawerOpen(true)}
					testId="open-button"
				>
					Open drawer
				</Button>
			</div>
		</div>
	);
}
