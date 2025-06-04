/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

/**
 * Styles to allow the body to be scrollable and placed for the VR snapshot.
 */
const containerStyles = css({
	display: 'flex',
	height: '200%',
	justifyContent: 'flex-end',
	paddingBlockEnd: token('space.200', '16px'),
	paddingBlockStart: token('space.200', '16px'),
	paddingInlineEnd: token('space.200', '16px'),
	paddingInlineStart: token('space.200', '16px'),
});

export default function DrawerExample() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const openDrawer = useCallback(() => setIsOpen(true), []);
	const closeDrawer = useCallback(() => setIsOpen(false), []);

	return (
		<div css={containerStyles}>
			<div>
				<p>This body content will not be scrollable while the drawer is open.</p>
				<br />
				<br />
				<p>Only the drawer content will be scrollable.</p>

				<br />
				<br />
				<Button type="button" onClick={openDrawer} testId="open-drawer">
					Open drawer
				</Button>
			</div>

			<Drawer onClose={closeDrawer} isOpen={isOpen} label="Drawer with scrollable content">
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent scrollContentLabel="Scrollable drawer">
					{/* Strictly used to target the content drawer for programmatic scrolling… */}
					<div data-testid="content-inner" />
					<Lorem count={100} />
				</DrawerContent>
			</Drawer>
		</div>
	);
}
