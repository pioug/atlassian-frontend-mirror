/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
	background: {
		position: 'fixed',
		zIndex: '1',
		paddingBlockStart: token('space.300', '24px'),
		paddingInlineEnd: token('space.300', '24px'),
		paddingBlockEnd: token('space.300', '24px'),
		paddingInlineStart: token('space.300', '24px'),
		backgroundColor: token('color.background.neutral'),
		border: `${token('border.width')} solid ${token('color.background.accent.gray.subtle')}`,
	},
});

export default function DrawerExample(): JSX.Element {
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
