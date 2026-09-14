/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
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
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
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
