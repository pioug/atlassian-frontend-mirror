import React from 'react';

import AKBadge from '@atlaskit/badge';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppLogo,
	AppSwitcher,
	ChatButton,
	CreateButton,
	Help,
	Notifications,
	Profile,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { FocusIcon } from '@atlaskit/temp-nav-app-icons/focus';

import { WithResponsiveViewport } from './utils/example-utils';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

export default function TopNavWithLongProductName() {
	return (
		<WithResponsiveViewport>
			{/**
			 * Wrapping in `Root to ensure the TopNav height is set correctly, as it would in a proper composed usage.
			 * Root sets the top bar height CSS variable that TopNav uses to set its height
			 */}
			<Root>
				<TopNav>
					<TopNavStart>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
						<AppSwitcher label="App switcher" />
						<AppLogo
							href="http://www.atlassian.design"
							icon={() => <FocusIcon size="24" />}
							name="Long text to stretch out text label to the maximum width"
							label="Home page"
						/>
					</TopNavStart>
					<TopNavMiddle>
						<Search label="Search" />
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<ChatButton>Chat</ChatButton>
						<Notifications label="Notifications" badge={Badge} />
						<Help label="Help" />
						<Settings label="Settings" />
						<Profile label="Your profile" />
					</TopNavEnd>
				</TopNav>
			</Root>
		</WithResponsiveViewport>
	);
}
