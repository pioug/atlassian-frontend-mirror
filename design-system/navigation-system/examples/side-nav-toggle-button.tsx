import React from 'react';

import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';

const SideNavToggleButtonExample = ({
	isSideNavShortcutEnabled,
}: {
	isSideNavShortcutEnabled?: boolean;
}) => (
	<Root isSideNavShortcutEnabled={isSideNavShortcutEnabled}>
		<TopNav>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
			</TopNavStart>
		</TopNav>
	</Root>
);

export const SideNavToggleButtonVR = () => <SideNavToggleButtonExample />;
export const SideNavToggleButtonWithShortcutVR = () => (
	<SideNavToggleButtonExample isSideNavShortcutEnabled />
);

export default SideNavToggleButtonWithShortcutVR;
