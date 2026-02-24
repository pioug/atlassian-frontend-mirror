import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import {
	FlyoutBody,
	FlyoutFooter,
	FlyoutHeader,
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/side-nav-items/flyout-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';

import { WithResponsiveViewport } from './utils/with-responsive-viewport';

/**
 * Listener callbacks supplied by consumers when registering. They will be called by the manager to
 * open or close the consumer when appropriate.
 */
type Listeners = {
	onClose: () => void;
	onOpen: () => void;
};

/**
 * Returned by the manager when a consumer registers.
 */
type Registration = {
	/**
	 * Should be called by the consumer when unmounting to remove the registration.
	 */
	cleanup: () => void;
	/**
	 * Should be called by the consumer when it needs to open.
	 */
	open: () => void;
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
	children: React.ReactNode;
	elemBefore: React.ReactNode;
	label: string;
	shortcutKey: string;
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

export default function MultipleFlyoutMenuExample(): React.JSX.Element {
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
								<FlyoutHeader title="Recent" closeButtonLabel="Close menu" />
								<FlyoutBody>
									<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
										ABC board
									</ButtonMenuItem>
								</FlyoutBody>
								<FlyoutFooter>
									<MenuList>
										<ButtonMenuItem
											elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}
										>
											View all recent items
										</ButtonMenuItem>
									</MenuList>
								</FlyoutFooter>
							</FlyoutWithShortcut>

							<FlyoutWithShortcut
								label="Starred"
								shortcutKey="s"
								elemBefore={<StarUnstarredIcon label="" color="currentColor" />}
							>
								<FlyoutHeader title="Starred" closeButtonLabel="Close menu" />
								<FlyoutBody>
									<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
										YNG board
									</ButtonMenuItem>
								</FlyoutBody>
								<FlyoutFooter>
									<MenuList>
										<ButtonMenuItem
											elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}
										>
											View all starred items
										</ButtonMenuItem>
									</MenuList>
								</FlyoutFooter>
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
