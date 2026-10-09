import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { SkeletonCreateButton } from '@atlaskit/atlassian-navigation/skeleton-create-button';
import { SkeletonHelpButton } from '@atlaskit/atlassian-navigation/skeleton-help-button';
import { SkeletonIconButton } from '@atlaskit/atlassian-navigation/skeleton-icon-button';
import { SkeletonNotificationButton } from '@atlaskit/atlassian-navigation/skeleton-notification-button';
import { SkeletonSettingsButton } from '@atlaskit/atlassian-navigation/skeleton-settings-button';
import { SkeletonSwitcherButton } from '@atlaskit/atlassian-navigation/skeleton-switcher-button';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraLogoCS as JiraLogo } from '@atlaskit/logo/jira/logo';

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
