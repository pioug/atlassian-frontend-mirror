import React from 'react';

import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';

const SideNavToggleButtonExample = ({ shortcut }: { shortcut?: string[] }) => (
	<Root>
		<TopNav>
			<TopNavStart>
				<SideNavToggleButton
					collapseLabel="Collapse sidebar"
					expandLabel="Expand sidebar"
					shortcut={shortcut}
				/>
			</TopNavStart>
		</TopNav>
	</Root>
);

export const SideNavToggleButtonVR = () => <SideNavToggleButtonExample />;
export const SideNavToggleButtonWithShortcutVR = () => (
	<SideNavToggleButtonExample shortcut={['Ctrl', '[']} />
);

export default SideNavToggleButtonWithShortcutVR;
