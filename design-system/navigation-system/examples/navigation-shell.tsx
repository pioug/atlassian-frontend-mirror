import React from 'react';

import { CustomerServiceManagementIcon, JiraIcon } from '@atlaskit/logo';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	CustomTitle,
	Help,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Spotlight, SpotlightManager, SpotlightTarget } from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

const defaultSideNavToggleButton = (
	<SideNavToggleButton
		testId="side-nav-toggle-button"
		collapseLabel="Collapse sidebar"
		expandLabel="Expand sidebar"
	/>
);

const defaultAppLogo = (
	<AppLogo
		href=""
		icon={CustomerServiceManagementIcon}
		name="Customer Service Management"
		label="Home page"
	/>
);

export default function NavigationShellExample({
	sideNavToggleButton = defaultSideNavToggleButton,
	appLogo = defaultAppLogo,
	defaultSideNavWidth,
	siteTitle,
}: {
	sideNavToggleButton?: React.ReactNode;
	appLogo?: React.ReactNode;
	defaultSideNavWidth?: number;
	siteTitle?: string;
}): React.JSX.Element {
	return (
		<WithResponsiveViewport>
			<Root>
				<TopNav>
					<TopNavStart sideNavToggleButton={sideNavToggleButton}>
						<AppSwitcher label="Switch apps" />
						{appLogo}
						{siteTitle && <CustomTitle>{siteTitle}</CustomTitle>}
					</TopNavStart>
					<TopNavMiddle>
						<MockSearch />
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<Help label="Help" />
						<Settings label="Settings" />
						<Profile label="Profile" />
					</TopNavEnd>
				</TopNav>
				<SideNav defaultWidth={defaultSideNavWidth}>{null}</SideNav>
				<Main>{null}</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

export function NavigationShellWithWideSideNav(): React.JSX.Element {
	return <NavigationShellExample defaultSideNavWidth={800} siteTitle="Custom title" />;
}

export function NavigationShellWithToggleButtonOnboarding(): React.JSX.Element {
	return (
		<SpotlightManager>
			<NavigationShellExample
				sideNavToggleButton={
					<SpotlightTarget name="side-nav-toggle-button">
						{defaultSideNavToggleButton}
					</SpotlightTarget>
				}
				appLogo={<AppLogo href="" icon={JiraIcon} name="Jira" label="Home page" />}
			/>
			<Spotlight
				target="side-nav-toggle-button"
				heading="Collapse the side nav"
				targetBgColor={token('elevation.surface')}
				targetRadius={3}
				actions={[{ text: 'Close' }]}
			/>
		</SpotlightManager>
	);
}
