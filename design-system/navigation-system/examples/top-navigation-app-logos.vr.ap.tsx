/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import AKBadge from '@atlaskit/badge/badge';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket-icon';
import { CompassIcon } from '@atlaskit/logo/compass/icon';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { CustomerServiceManagementIcon } from '@atlaskit/logo/customer-service-management/icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management-icon';
import { OpsgenieIcon } from '@atlaskit/logo/opsgenie-icon';
import { TrelloIcon } from '@atlaskit/logo/trello-icon';
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
	Search,
} from '@atlaskit/navigation-system/top-nav-items';
import { CreateButton } from '@atlaskit/navigation-system/top-nav-items/create-button';
import { Help } from '@atlaskit/navigation-system/top-nav-items/help';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
import { Profile } from '@atlaskit/navigation-system/top-nav-items/profile';
import { Settings } from '@atlaskit/navigation-system/top-nav-items/settings';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import placeholder200x200 from './images/200x200.png';
import { WithResponsiveViewport } from './utils/example-utils';
import { MockRoot } from './utils/mock-root';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

const generateImageComponent = (image: string) => () => <img alt="" src={image} />;

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

export const TopNavigationAppLogosExample: () => JSX.Element = () => (
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
			<TopNavigationInstance
				icon={generateImageComponent(placeholder200x200)}
				name="Custom app logo component (oversized)"
			/>
		</Stack>
	</WithResponsiveViewport>
);

export const TopNavigationAppLogoOversizeExample: () => JSX.Element = () => (
	<WithResponsiveViewport>
		<TopNavigationInstance
			icon={generateImageComponent(placeholder200x200)}
			name="Custom app logo component (oversized)"
		/>
	</WithResponsiveViewport>
);

export default TopNavigationAppLogosExample;
