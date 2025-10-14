/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import AKBadge from '@atlaskit/badge';
import {
	BitbucketIcon,
	CompassIcon,
	ConfluenceIcon,
	CustomerServiceManagementIcon,
	JiraIcon,
	JiraServiceManagementIcon,
	OpsgenieIcon,
	TrelloIcon,
} from '@atlaskit/logo';
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
	Profile,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
import { Stack } from '@atlaskit/primitives/compiled';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockRoot } from './utils/mock-root';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

const TopNavigationInstance = ({ icon, name }: { icon: any; name: string }) => {
	return (
		/**
		 * Wrapping in MockRoot to ensure the TopNav height is set correctly for examples.
		 * MockRoot allows us to show multiple top bars on the same example and avoids examples occupying the full screen height.
		 */
		<MockRoot>
			<TopNav>
				<TopNavStart
					sideNavToggleButton={
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					}
				>
					<AppSwitcher label="App switcher" onClick={() => alert('app switcher')} />
					<AppLogo href="http://www.atlassian.design" icon={icon} name={name} label="Home page" />
				</TopNavStart>
				<TopNavMiddle>
					<Search onClick={() => alert('mobile search')} label="Search" />
					<CreateButton onClick={() => alert('create')}>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<ChatButton onClick={() => alert('chat')}>Chat</ChatButton>
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
		</MockRoot>
	);
};

export const TopNavigationAppLogosExample = () => (
	<WithResponsiveViewport>
		<Stack space="space.050" testId="top-navigation-product-logos">
			<TopNavigationInstance icon={ConfluenceIcon} name="Confluence" />
			<TopNavigationInstance icon={JiraIcon} name="Jira" />
			<TopNavigationInstance icon={BitbucketIcon} name="Bitbucket" />
			<TopNavigationInstance icon={TrelloIcon} name="Trello" />
			<TopNavigationInstance icon={CompassIcon} name="Compass" />
			<TopNavigationInstance icon={OpsgenieIcon} name="Opsgenie" />
			<TopNavigationInstance icon={JiraServiceManagementIcon} name="Jira Service Management" />
			<TopNavigationInstance
				icon={CustomerServiceManagementIcon}
				name="Customer Service Management"
			/>
		</Stack>
	</WithResponsiveViewport>
);

export default TopNavigationAppLogosExample;
