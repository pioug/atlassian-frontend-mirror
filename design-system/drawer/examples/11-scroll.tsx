/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { token } from '@atlaskit/tokens';

import { Lorem } from './lorem';

/**
 * Styles to allow the body to be scrollable and placed for the VR snapshot.
 */
const containerStyles = css({
	display: 'flex',
	height: '200%',
	justifyContent: 'flex-end',
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

export default function DrawerExample(): JSX.Element {
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
