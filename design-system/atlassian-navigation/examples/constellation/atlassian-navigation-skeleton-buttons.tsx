/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { SkeletonCreateButton } from '@atlaskit/atlassian-navigation/skeleton-create-button';
import { SkeletonHelpButton } from '@atlaskit/atlassian-navigation/skeleton-help-button';
import { SkeletonIconButton } from '@atlaskit/atlassian-navigation/skeleton-icon-button';
import { SkeletonNotificationButton } from '@atlaskit/atlassian-navigation/skeleton-notification-button';
import { SkeletonPrimaryButton } from '@atlaskit/atlassian-navigation/skeleton-primary-button';
import { SkeletonSettingsButton } from '@atlaskit/atlassian-navigation/skeleton-settings-button';
import { SkeletonSwitcherButton } from '@atlaskit/atlassian-navigation/skeleton-switcher-button';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraLogoCS as JiraLogo } from '@atlaskit/logo/jira/logo';

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

const AtlassianNavigationSkeletonButtons = (): React.JSX.Element => {
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
