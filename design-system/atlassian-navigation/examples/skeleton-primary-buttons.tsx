import React from 'react';

import { AtlassianNavigation, ProductHome } from '@atlaskit/atlassian-navigation';
import { SkeletonCreateButton, SkeletonIconButton } from '@atlaskit/atlassian-navigation/skeleton';
import { SkeletonHelpButton } from '@atlaskit/atlassian-navigation/skeleton-help-button';
import { SkeletonNotificationButton } from '@atlaskit/atlassian-navigation/skeleton-notification-button';
import { SkeletonSettingsButton } from '@atlaskit/atlassian-navigation/skeleton-settings-button';
import { SkeletonSwitcherButton } from '@atlaskit/atlassian-navigation/skeleton-switcher-button';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import { avatarUrl } from './shared/profile-popup';

const SkeletonCreate = () => <SkeletonCreateButton text="Create"></SkeletonCreateButton>;
const SkeletonProfileButton = () => (
	<SkeletonIconButton>
		<img src={avatarUrl} alt="Your profile and settings" />
	</SkeletonIconButton>
);

const AtlassianNavigationExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		moreLabel="More"
		primaryItems={[]}
		renderAppSwitcher={() => <SkeletonSwitcherButton label="switcher button" />}
		renderCreate={SkeletonCreate}
		renderProductHome={() => <ProductHome icon={JiraIcon} logo={JiraLogo} siteTitle="Hello" />}
		renderProfile={SkeletonProfileButton}
		renderSettings={() => <SkeletonSettingsButton label="settings button" />}
		renderHelp={() => <SkeletonHelpButton label="help button" />}
		renderNotifications={() => <SkeletonNotificationButton label="notifications button" />}
	/>
);

export default AtlassianNavigationExample;
