import React, { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
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
			if (event.ctrlKey && event.key === '[') {
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
			<TopNavStart
				sideNavToggleButton={
					<SideNavToggleButton
						collapseLabel="Collapse sidebar"
						expandLabel="Expand sidebar"
						shortcut={['Ctrl', '[']}
					/>
				}
			>
				top nav
			</TopNavStart>
		</TopNav>
		<SideNav>
			side nav
			<PanelSplitter
				label="Resize side nav"
				tooltipContent="Collapse sidebar"
				shortcut={['Ctrl', '[']}
			/>
		</SideNav>
		<ToggleSideNavKeyboardShortcut />
		<Main>main content</Main>
	</Root>
);

export default SideNavWithCollapseShortcut;
