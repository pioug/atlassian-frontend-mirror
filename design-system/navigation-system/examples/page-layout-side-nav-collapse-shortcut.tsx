import React, { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavToggleButton,
	useToggleSideNav,
} from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';

const ToggleSideNavKeyboardShortcut = () => {
	const toggleSideNav = useToggleSideNav();

	useEffect(() => {
		const toggle = (event: KeyboardEvent) => {
			if (event.key === '[') {
				toggleSideNav();
			}
		};

		return bind(document, {
			type: 'keydown',
			listener: toggle,
		});
	}, [toggleSideNav]);

	return null;
};

const SideNavWithCollapseShortcut = () => (
	<Root>
		<TopNav>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				top nav
			</TopNavStart>
		</TopNav>
		<SideNav>side nav</SideNav>
		<ToggleSideNavKeyboardShortcut />
		<Main>main content</Main>
	</Root>
);

export default SideNavWithCollapseShortcut;
