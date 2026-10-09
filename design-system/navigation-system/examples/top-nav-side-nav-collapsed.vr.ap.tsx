import React from 'react';

import AKBadge from '@atlaskit/badge/badge';
import AtlassianIntelligenceIcon from '@atlaskit/icon/core/atlassian-intelligence';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
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
	EndItem,
	Search,
} from '@atlaskit/navigation-system/top-nav-items';
import { CreateButton } from '@atlaskit/navigation-system/top-nav-items/create-button';
import { Help } from '@atlaskit/navigation-system/top-nav-items/help';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
import { Profile } from '@atlaskit/navigation-system/top-nav-items/profile';
import { Settings } from '@atlaskit/navigation-system/top-nav-items/settings';

import { WithResponsiveViewport } from './utils/example-utils';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

const TopNavSideNavCollapsed = (): React.JSX.Element => (
	<WithResponsiveViewport>
		<Root>
			<TopNav>
				<TopNavStart
					sideNavToggleButton={
						<SideNavToggleButton
							defaultCollapsed
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
						/>
					}
				>
					<AppSwitcher label="App switcher" onClick={() => alert('app switcher')} />
					<AppLogo
						href="http://www.atlassian.design"
						icon={ConfluenceIcon}
						name="Confluence"
						label="Home page"
					/>
				</TopNavStart>
				<TopNavMiddle>
					<Search onClick={() => alert('mobile search')} label="Search" />
					<CreateButton onClick={() => alert('create')}>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<ChatButton onClick={() => alert('chat')}>Chat</ChatButton>
					<EndItem
						icon={AtlassianIntelligenceIcon}
						onClick={() => alert('inshelligence')}
						label="Atlassian Intelligence"
					/>
					<Help onClick={() => alert('help')} label="Help" />
					<Notifications
						badge={Badge}
						onClick={() => alert('notifications')}
						label="Notifications"
					/>
					<Settings label="Settings" />
					<Profile onClick={() => alert('User settings')} label="Your profile" />
				</TopNavEnd>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

export default TopNavSideNavCollapsed;
