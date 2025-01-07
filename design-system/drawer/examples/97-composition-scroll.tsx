/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import { token } from '@atlaskit/tokens';

/**
 * Styles to allow the body to be scrollable and placed for the VR snapshot.
 */
const containerStyles = css({
	display: 'flex',
	height: '200%',
	padding: token('space.200', '16px'),
	justifyContent: 'flex-end',
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
