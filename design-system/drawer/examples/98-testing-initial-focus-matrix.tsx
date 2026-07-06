import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';

/**
 * Test fixture: exercises the focus behaviour the top-layer `Drawer` inherits
 * from the `@atlaskit/top-layer` `Dialog` primitive (native `<dialog>`), driven
 * through the public `Drawer` API.
 *
 * The top-layer `Drawer` renders a native modal `<dialog>` via `showModal()`,
 * which owns both initial focus and focus trapping:
 *
 * - `default-drawer`: no element inside the drawer carries the native HTML
 *   `autofocus` attribute, so `showModal()` focuses the first focusable element
 *   (the close button in the sidebar).
 *
 * - `native-autofocus-drawer`: an interior `<input>` carries the native HTML
 *   `autofocus` attribute (set via a ref callback because React 18 does not
 *   reflect the JSX `autoFocus` prop onto the DOM attribute). `showModal()`'s
 *   focusing steps prefer the `autofocus` element over the first focusable, so
 *   focus must land on that input, not the close button.
 *
 * - `multi-focusable-drawer`: several focusable elements after the close button,
 *   used to exercise the `Dialog` primitive's `useFocusWrap` hook — Tab cycles
 *   forward through all focusables and wraps, Shift+Tab cycles backward.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [openVariant, setOpenVariant] = useState<
		'none' | 'default' | 'native-autofocus' | 'multi-focusable'
	>('none');

	const close = useCallback(() => setOpenVariant('none'), []);

	const setNativeAutofocus = useCallback((node: HTMLInputElement | null) => {
		if (node === null) {
			return;
		}
		// React 18 does not reflect the JSX `autoFocus` prop as the HTML
		// `autofocus` attribute, which is what the native `<dialog>` focusing
		// steps look for. Set it explicitly so this fixture exercises the
		// autofocus branch.
		node.setAttribute('autofocus', '');
	}, []);

	return (
		<div>
			<Button onClick={() => setOpenVariant('default')} testId="default-drawer-trigger">
				Open default drawer
			</Button>

			<Button
				onClick={() => setOpenVariant('native-autofocus')}
				testId="native-autofocus-drawer-trigger"
			>
				Open drawer with native autofocus
			</Button>

			<Button
				onClick={() => setOpenVariant('multi-focusable')}
				testId="multi-focusable-drawer-trigger"
			>
				Open drawer with multiple focusable elements
			</Button>

			<Drawer
				isOpen={openVariant === 'default'}
				onClose={close}
				label="Default drawer"
				testId="default-drawer"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<p>No native autofocus element; expect the first focusable to win.</p>
				</DrawerContent>
			</Drawer>

			<Drawer
				isOpen={openVariant === 'native-autofocus'}
				onClose={close}
				label="Drawer with native autofocus"
				testId="native-autofocus-drawer"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<label htmlFor="native-autofocus-input">Name</label>
					<input
						id="native-autofocus-input"
						data-testid="native-autofocus-input"
						ref={setNativeAutofocus}
						type="text"
					/>
				</DrawerContent>
			</Drawer>

			<Drawer
				isOpen={openVariant === 'multi-focusable'}
				onClose={close}
				label="Drawer with multiple focusable elements"
				testId="multi-focusable-drawer"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Button testId="focusable-1">First</Button>
					<Button testId="focusable-2">Second</Button>
					<Button testId="focusable-3">Third</Button>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
