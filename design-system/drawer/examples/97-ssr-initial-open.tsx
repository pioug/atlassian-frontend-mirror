import React, { useCallback, useState } from 'react';

import Drawer from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';

/**
 * Drawer that is `isOpen={true}` on initial render. Used by tests; do not
 * modify without checking SSR + hydration parity coverage.
 *
 * On the top-layer path the native `<dialog>` is upgraded to a modal via
 * `showModal()` in a layout effect after hydration, so this fixture guards the
 * server-render → hydrate → `showModal()` startup sequence.
 */
export default function SsrInitialOpenDrawer(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(true);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<p>Page content behind the drawer.</p>
			<Drawer
				isOpen={isOpen}
				onClose={close}
				label="Initially open drawer"
				testId="ssr-initial-open-drawer"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<p data-testid="ssr-initial-open-drawer-body">This drawer is open on initial render.</p>
				</DrawerContent>
			</Drawer>
		</>
	);
}
