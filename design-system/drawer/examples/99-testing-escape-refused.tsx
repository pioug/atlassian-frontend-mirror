import React, { useRef, useState } from 'react';

import Drawer from '@atlaskit/drawer/drawer';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

/**
 * Test fixture: a drawer whose consumer refuses Escape (it keeps `isOpen` true in `onClose`).
 * Escape must never close it natively. It has a child popup and a nested drawer that closes in
 * `onClose`. `closing-drawer` closes in `onClose`, to test Escape during the exit.
 */
export default function TestingEscapeRefused(): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [closeCount, setCloseCount] = useState(0);
	const [isClosingOpen, setIsClosingOpen] = useState(false);
	const [isChildPopupOpen, setIsChildPopupOpen] = useState(false);
	const [isNestedOpen, setIsNestedOpen] = useState(false);
	const [nestedCloseCount, setNestedCloseCount] = useState(0);
	const childPopupTriggerRef = useRef<HTMLButtonElement>(null);
	const childPopupRef = useRef<HTMLDivElement>(null);

	useAnchoredPopover({
		anchorRef: childPopupTriggerRef,
		popoverRef: childPopupRef,
		placement: { edge: 'end' },
		isOpen: isChildPopupOpen,
	});

	return (
		<div>
			<button type="button" data-testid="drawer-trigger" onClick={() => setIsOpen(true)}>
				Open drawer
			</button>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="nested-close-count">{nestedCloseCount}</div>
			<Drawer
				testId="drawer"
				label="Escape refused"
				isOpen={isOpen}
				onClose={() => setCloseCount((count) => count + 1)}
			>
				<DrawerContent>
					<button type="button" data-testid="drawer-button">
						Drawer button
					</button>
					<button
						ref={childPopupTriggerRef}
						type="button"
						data-testid="child-popup-trigger"
						onClick={() => setIsChildPopupOpen((previous) => !previous)}
					>
						Open popup
					</button>
					<Popover
						ref={childPopupRef}
						isOpen={isChildPopupOpen}
						onClose={() => setIsChildPopupOpen(false)}
						role="dialog"
						label="Child popup"
					>
						<button type="button" data-testid="child-popup-button">
							In popup
						</button>
					</Popover>
					<button
						type="button"
						data-testid="nested-drawer-trigger"
						onClick={() => setIsNestedOpen(true)}
					>
						Open nested drawer
					</button>
					<Drawer
						testId="nested-drawer"
						label="Nested drawer"
						isOpen={isNestedOpen}
						onClose={() => {
							setNestedCloseCount((count) => count + 1);
							setIsNestedOpen(false);
						}}
					>
						<DrawerContent>
							<button type="button" data-testid="nested-drawer-button">
								Nested drawer button
							</button>
						</DrawerContent>
					</Drawer>
					<button type="button" onClick={() => setIsOpen(false)}>
						Close
					</button>
				</DrawerContent>
			</Drawer>
			<button
				type="button"
				data-testid="closing-drawer-trigger"
				onClick={() => setIsClosingOpen(true)}
			>
				Open closing drawer
			</button>
			<Drawer
				testId="closing-drawer"
				label="Closes on Escape"
				isOpen={isClosingOpen}
				onClose={() => {
					setCloseCount((count) => count + 1);
					setIsClosingOpen(false);
				}}
			>
				<DrawerContent>
					<button type="button" data-testid="closing-drawer-button">
						Drawer button
					</button>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
