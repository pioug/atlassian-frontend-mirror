import React from 'react';

import AKBadge from '@atlaskit/badge';
import AtlassianIntelligenceIcon from '@atlaskit/icon/core/atlassian-intelligence';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppSwitcher,
	ChatButton,
	CreateButton,
	EndItem,
	Help,
	NavLogo,
	Profile,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';

import KoalaImage from './images/koala.png';
import { WithResponsiveViewport } from './utils/example-utils';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

export const TopNavCustomProfileImage = () => (
	<WithResponsiveViewport>
		<Root>
			<TopNav>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<AppSwitcher label="App switcher" onClick={() => alert('app switcher')} />
					<NavLogo
						href="http://www.atlassian.design"
						logo={AtlassianLogo}
						icon={AtlassianIcon}
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
					<Profile src={KoalaImage} onClick={() => alert('User settings')} label="Your profile" />
				</TopNavEnd>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

export default TopNavCustomProfileImage;
