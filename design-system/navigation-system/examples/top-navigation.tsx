/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import AKBadge from '@atlaskit/badge';
import AtlassianIntelligenceIcon from '@atlaskit/icon/core/atlassian-intelligence';
import SearchIcon from '@atlaskit/icon/core/search';
import { ConfluenceIcon } from '@atlaskit/logo';
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
	EndItem,
	Help,
	Profile,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

export const TopNavigationExample = () => (
	<WithResponsiveViewport>
		{/**
		 * Wrapping in `Root to ensure the TopNav height is set correctly, as it would in a proper composed usage.
		 * Root sets the top bar height CSS variable that TopNav uses to set its height
		 */}
		<Root>
			<TopNav>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
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
					<Settings onClick={() => alert('settings')} label="Settings" />
					<Profile onClick={() => alert('User settings')} label="Your profile" />
				</TopNavEnd>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

export const SearchRightElem = () => (
	<WithResponsiveViewport>
		<Root>
			<TopNav>
				<TopNavStart>
					<AppSwitcher label="App switcher" onClick={() => alert('app switcher')} />
				</TopNavStart>
				<TopNavMiddle>
					<Search
						iconBefore={AtlassianIntelligenceIcon}
						elemAfter={<SearchIcon spacing="spacious" color={token('color.icon')} label="" />}
						onClick={() => alert('mobile search')}
						label="Search"
					/>
					<CreateButton onClick={() => alert('create')}>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Settings onClick={() => alert('settings')} label="Settings" />
				</TopNavEnd>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

export const TopNavigationEnlargedSearchInput = () => (
	<WithResponsiveViewport>
		<Root>
			<TopNav>
				<TopNavStart>
					<AppSwitcher label="App switcher" onClick={() => alert('app switcher')} />
				</TopNavStart>
				<div>
					<TopNavMiddle>
						<MockSearch isEnlarged />
						<CreateButton onClick={() => alert('create')}>Create</CreateButton>
					</TopNavMiddle>
				</div>
				<TopNavEnd>
					<Settings onClick={() => alert('settings')} label="Settings" />
				</TopNavEnd>
			</TopNav>
		</Root>
	</WithResponsiveViewport>
);

export default TopNavigationExample;
