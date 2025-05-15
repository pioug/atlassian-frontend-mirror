import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import NotificationIcon from '@atlaskit/icon/core/migration/notification';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { Stack } from '@atlaskit/primitives';

import { DefaultCreate } from '../../../examples/shared/create';
import { jiraPrimaryItems } from '../../../examples/shared/primary-items';
import {
	DefaultCustomProductHome,
	JiraProductHome,
	JiraServiceManagementProductHome,
} from '../../../examples/shared/product-home';
import { DefaultProfile } from '../../../examples/shared/profile';
import Search from '../../../examples/shared/search';
import { themes } from '../../../examples/shared/themes';
import {
	AppSwitcher,
	AtlassianNavigation,
	Help,
	Notifications,
	ProductHome,
	Settings,
} from '../../index';
import {
	NavigationSkeleton,
	SkeletonCreateButton,
	SkeletonIconButton,
	SkeletonPrimaryButton,
} from '../../skeleton';

const NotificationsBadge = () => (
	<NotificationIndicator
		onCountUpdated={__noop}
		notificationLogProvider={Promise.resolve({}) as any}
	/>
);
const DefaultAppSwitcher = () => <AppSwitcher tooltip="Switch to..." />;
const DefaultSettings = () => <Settings tooltip="Product settings" />;

const NavExample = () => (
	<AtlassianNavigation
		label="site"
		renderAppSwitcher={DefaultAppSwitcher}
		renderProductHome={JiraProductHome}
		primaryItems={jiraPrimaryItems}
		renderHelp={() => <Help tooltip="Get help" />}
		renderSettings={DefaultSettings}
		renderCreate={DefaultCreate}
		renderSearch={Search}
		renderNotifications={() => <Notifications badge={NotificationsBadge} tooltip="Notifications" />}
		renderProfile={DefaultProfile}
	/>
);

const ThemingExample = () => (
	<>
		{themes.map((theme) => (
			<Stack space="space.200">
				<AtlassianNavigation
					label="site"
					renderAppSwitcher={DefaultAppSwitcher}
					renderProductHome={JiraServiceManagementProductHome}
					primaryItems={jiraPrimaryItems}
					renderHelp={() => <Help tooltip="Get help" />}
					renderSettings={DefaultSettings}
					renderCreate={DefaultCreate}
					renderSearch={Search}
					renderNotifications={() => (
						<Notifications badge={NotificationsBadge} tooltip="Notifications" />
					)}
					renderProfile={DefaultProfile}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					theme={theme}
				/>
			</Stack>
		))}
	</>
);

// using Home, Create and Search - these components should adapt to small screens
// using an empty primaryItems array until the feature flag is removed or PFF support
// is in gemini
const ResponsiveCreateHomeAndSearchExample = () => (
	<AtlassianNavigation
		label="site"
		primaryItems={[]}
		renderProductHome={() => (
			<ProductHome aria-label={'Jira'} icon={JiraIcon} logo={JiraLogo} testId="jira-product-home" />
		)}
		renderCreate={DefaultCreate}
		renderSearch={Search}
	/>
);

const CustomProductHomeExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={DefaultCustomProductHome}
		primaryItems={[]}
		renderCreate={DefaultCreate}
		renderSearch={Search}
	/>
);

const skeletonPrimaryItems = [
	<SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
	<SkeletonPrimaryButton isDropdownButton text="Projects" />,
	<SkeletonPrimaryButton isDropdownButton isHighlighted text="Filters &amp; work items" />,
	<SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
	<SkeletonPrimaryButton isDropdownButton text="Apps" testId="apps-skeleton" />,
];

const SkeletonButtonsExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={DefaultCustomProductHome}
		primaryItems={skeletonPrimaryItems}
		renderCreate={() => <SkeletonCreateButton text="Create"></SkeletonCreateButton>}
		renderNotifications={() => (
			<SkeletonIconButton>
				<NotificationIcon color="currentColor" label="Notifications" />
			</SkeletonIconButton>
		)}
	/>
);

const ThemedSkeletonButtonsExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={DefaultCustomProductHome}
		primaryItems={skeletonPrimaryItems}
		renderCreate={() => <SkeletonCreateButton text="Create"></SkeletonCreateButton>}
		renderNotifications={() => (
			<SkeletonIconButton>
				<NotificationIcon color="currentColor" spacing="spacious" label="Notifications" />
			</SkeletonIconButton>
		)}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
		theme={themes[1]}
	/>
);

const NavigationSkeletonExample = () => (
	<NavigationSkeleton primaryItemsCount={4} secondaryItemsCount={3} shouldShowSearch={true} />
);

const ThemingNavigationSkeletonExample = () => (
	<>
		{themes.map((theme) => (
			<Stack space="space.200">
				<NavigationSkeleton
					primaryItemsCount={4}
					secondaryItemsCount={3}
					shouldShowSearch={true}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					theme={theme}
				/>
			</Stack>
		))}
	</>
);

export {
	NavExample,
	ThemingExample,
	ResponsiveCreateHomeAndSearchExample,
	CustomProductHomeExample,
	SkeletonButtonsExample,
	ThemedSkeletonButtonsExample,
	NavigationSkeletonExample,
	ThemingNavigationSkeletonExample,
};
