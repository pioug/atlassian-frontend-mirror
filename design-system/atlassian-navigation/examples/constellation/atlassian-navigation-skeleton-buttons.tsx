/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { AtlassianNavigation, ProductHome } from '@atlaskit/atlassian-navigation';
import {
	SkeletonCreateButton,
	SkeletonIconButton,
	SkeletonPrimaryButton,
} from '@atlaskit/atlassian-navigation/skeleton';
import { SkeletonHelpButton } from '@atlaskit/atlassian-navigation/skeleton-help-button';
import { SkeletonNotificationButton } from '@atlaskit/atlassian-navigation/skeleton-notification-button';
import { SkeletonSettingsButton } from '@atlaskit/atlassian-navigation/skeleton-settings-button';
import { SkeletonSwitcherButton } from '@atlaskit/atlassian-navigation/skeleton-switcher-button';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import { avatarUrl } from '../shared/profile-popup';

const SkeletonCreate = () => <SkeletonCreateButton text="Create"></SkeletonCreateButton>;
const SkeletonProfileButton = () => (
	<SkeletonIconButton>
		<img src={avatarUrl} alt="Your profile and settings" />
	</SkeletonIconButton>
);
const skeletonPrimaryItems = [
	<SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
	<SkeletonPrimaryButton isDropdownButton text="Projects" />,
	<SkeletonPrimaryButton isDropdownButton isHighlighted text="Filters &amp; work items" />,
	<SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
	<SkeletonPrimaryButton isDropdownButton text="Apps" testId="apps-skeleton" />,
];

const AtlassianNavigationSkeletonButtons = () => {
	return (
		<Fragment>
			<AtlassianNavigation
				label="site"
				moreLabel="More"
				primaryItems={skeletonPrimaryItems}
				renderAppSwitcher={() => <SkeletonSwitcherButton label="switcher button" />}
				renderCreate={SkeletonCreate}
				renderProductHome={() => <ProductHome icon={JiraIcon} logo={JiraLogo} siteTitle="Hello" />}
				renderProfile={SkeletonProfileButton}
				renderSettings={() => <SkeletonSettingsButton label="settings button" />}
				renderHelp={() => <SkeletonHelpButton label="help button" />}
				renderNotifications={() => <SkeletonNotificationButton label="notifications button" />}
				testId="atlassian-navigation"
			/>
		</Fragment>
	);
};

export default AtlassianNavigationSkeletonButtons;
