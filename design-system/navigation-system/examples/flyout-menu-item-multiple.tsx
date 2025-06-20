import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';

import { WithResponsiveViewport } from './utils/example-utils';

/**
 * Listener callbacks supplied by consumers when registering. They will be called by the manager to
 * open or close the consumer when appropriate.
 */
type Listeners = {
	onOpen: () => void;
	onClose: () => void;
};

/**
 * Returned by the manager when a consumer registers.
 */
type Registration = {
	/**
	 * Should be called by the consumer when it needs to open.
	 */
	open: () => void;
	/**
	 * Should be called by the consumer when unmounting to remove the registration.
	 */
	cleanup: () => void;
};

type Manager = {
	register: (listeners: Listeners) => Registration;
};

const ManagerContext = createContext<Manager>({
	register: () => ({
		open: () => {},
		cleanup: () => {},
	}),
});

function getManager(): Manager {
	const ledger = new Map<Registration, Listeners>();

	function register(listeners: Listeners): Registration {
		const registration: Registration = {
			open() {
				Array.from(ledger).forEach(([item, callbacks]) => {
					if (item === registration) {
						callbacks.onOpen();
						return;
					}
					callbacks.onClose();
				});
			},
			cleanup() {
				ledger.delete(registration);
			},
		};

		ledger.set(registration, listeners);

		return registration;
	}

	return { register };
}

function FlyoutWithShortcut({
	label,
	shortcutKey,
	elemBefore,
	children,
}: {
	label: string;
	shortcutKey: string;
	elemBefore: React.ReactNode;
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const manager = useContext(ManagerContext);

	useEffect(
		function mount() {
			const registration = manager.register({
				onOpen: () => setIsOpen(true),
				onClose: () => setIsOpen(false),
			});

			const cleanupEvents = bind(window, {
				type: 'keydown',
				listener: (event: KeyboardEvent) => {
					if (event.key === shortcutKey) {
						registration.open();
					}
				},
			});

			return function unmount() {
				registration.cleanup();
				cleanupEvents();
			};
		},
		[manager, shortcutKey],
	);

	const closeFlyout = useCallback(() => setIsOpen(false), []);
	const toggleFlyout = useCallback(() => setIsOpen((prev) => !prev), []);

	return (
		<FlyoutMenuItem isOpen={isOpen} onOpenChange={setIsOpen}>
			<FlyoutMenuItemTrigger elemBefore={elemBefore} onClick={toggleFlyout}>
				{label}
			</FlyoutMenuItemTrigger>
			<FlyoutMenuItemContent onClose={closeFlyout}>{children}</FlyoutMenuItemContent>
		</FlyoutMenuItem>
	);
}

export default function MultipleFlyoutMenuExample() {
	const [manager] = useState(() => getManager());

	return (
		<WithResponsiveViewport>
			<Root>
				<SideNav>
					<SideNavContent>
						<ManagerContext.Provider value={manager}>
							<FlyoutWithShortcut
								label="Recent"
								shortcutKey="r"
								elemBefore={<ClockIcon label="" color="currentColor" />}
							>
								<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
									ABC board
								</ButtonMenuItem>
								<Divider />
								<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}>
									View all recent items
								</ButtonMenuItem>
							</FlyoutWithShortcut>

							<FlyoutWithShortcut
								label="Starred"
								shortcutKey="s"
								elemBefore={<StarUnstarredIcon label="" color="currentColor" />}
							>
								<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
									YNG board
								</ButtonMenuItem>
								<Divider />
								<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}>
									View all starred items
								</ButtonMenuItem>
							</FlyoutWithShortcut>
						</ManagerContext.Provider>

						<ButtonMenuItem elemBefore={<ShowMoreHorizontalIcon label="" color="currentColor" />}>
							More
						</ButtonMenuItem>
					</SideNavContent>
				</SideNav>
			</Root>
		</WithResponsiveViewport>
	);
}
