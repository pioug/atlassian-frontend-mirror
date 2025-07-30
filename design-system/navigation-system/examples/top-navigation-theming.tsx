import React, { useReducer } from 'react';

import AKBadge from '@atlaskit/badge';
import { AtlassianIcon, AtlassianLogo, JiraIcon } from '@atlaskit/logo';
import { parseHex } from '@atlaskit/navigation-system/experimental/color-utils/parse-hex';
import { parseHsl } from '@atlaskit/navigation-system/experimental/color-utils/parse-hsl';
import { parseRgb } from '@atlaskit/navigation-system/experimental/color-utils/parse-rgb';
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
	CustomLogo,
	CustomTitle,
	Help,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives';

// TODO: consider exposing this type properly, but it isn't needed for normal usage
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { type CustomTheme } from '../src/ui/top-nav-items/themed/get-custom-theme-styles';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockRoot } from './utils/mock-root';
import { MockSearch } from './utils/mock-search';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

const TopNavigationThemingInstance = ({
	customTheme,
	useCustomLogo,
}: {
	customTheme?: CustomTheme;
	useCustomLogo?: boolean;
}) => {
	const [isAppSwitcherSelected, toggleIsAppSwitcherSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);
	const [isChatSelected, toggleIsChatSelected] = useReducer((isSelected) => !isSelected, false);
	const [isNotificationsSelected, toggleIsNotificationsSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);
	const [isHelpSelected, toggleIsHelpSelected] = useReducer((isSelected) => !isSelected, false);
	const [isSettingsSelected, toggleIsSettingsSelected] = useReducer(
		(isSelected) => !isSelected,
		true,
	);
	const [isProfileSelected, toggleIsProfileSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);

	return (
		/**
		 * Wrapping in `Root to ensure the TopNav height is set correctly, as it would in a proper composed usage.
		 * Root sets the top bar height CSS variable that TopNav uses to set its height
		 */
		<MockRoot>
			<TopNav UNSAFE_theme={customTheme}>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<AppSwitcher
						label="App switcher"
						onClick={toggleIsAppSwitcherSelected}
						isSelected={isAppSwitcherSelected}
					/>
					{useCustomLogo ? (
						<CustomLogo
							href="http://www.atlassian.design"
							icon={AtlassianIcon}
							logo={AtlassianLogo}
							label="Home page"
						/>
					) : (
						<AppLogo
							href="http://www.atlassian.design"
							icon={JiraIcon}
							name="Jira"
							label="Home page"
						/>
					)}
					<CustomTitle>Optional custom title</CustomTitle>
				</TopNavStart>
				<TopNavMiddle>
					<MockSearch />
					<CreateButton>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<ChatButton onClick={toggleIsChatSelected} isSelected={isChatSelected}>
						Chat
					</ChatButton>
					<Notifications
						badge={Badge}
						isSelected={isNotificationsSelected}
						onClick={toggleIsNotificationsSelected}
						label="Notifications"
					/>
					<Help label="Help" onClick={toggleIsHelpSelected} isSelected={isHelpSelected} />
					<Settings
						isSelected={isSettingsSelected}
						onClick={toggleIsSettingsSelected}
						label="Settings"
					/>
					<Profile
						isSelected={isProfileSelected}
						onClick={toggleIsProfileSelected}
						label="Your profile"
					/>
				</TopNavEnd>
			</TopNav>
		</MockRoot>
	);
};

export const TopNavigationThemingExample = () => (
	<WithResponsiveViewport>
		<Stack space="space.200">
			<TopNavigationThemingInstance
				customTheme={{ backgroundColor: parseHex('#FFF'), highlightColor: parseHex('#d8388a') }}
			/>
			<TopNavigationThemingInstance
				// Hex notation is still supported for backwards compatibility
				// Keeping at least some VR coverage for it
				customTheme={{ backgroundColor: '#e8cbd2', highlightColor: '#333' }}
			/>
			<TopNavigationThemingInstance
				customTheme={{ backgroundColor: parseHex('#ef816b'), highlightColor: parseHex('#FDEE80') }}
			/>
			<TopNavigationThemingInstance
				customTheme={{ backgroundColor: parseHex('#997A82'), highlightColor: parseHex('#333') }}
			/>
			<TopNavigationThemingInstance
				customTheme={{ backgroundColor: parseHex('#5B5FAE'), highlightColor: parseHex('#6FF2B4') }}
			/>
			<TopNavigationThemingInstance
				customTheme={{ backgroundColor: parseHex('#000448'), highlightColor: parseHex('#6FF2B4') }}
			/>
			<TopNavigationThemingInstance
				customTheme={{ backgroundColor: parseHex('#272727'), highlightColor: parseHex('#E94E34') }}
			/>
		</Stack>
	</WithResponsiveViewport>
);

export const TopNavigationThemingSingleExample = () => (
	<WithResponsiveViewport>
		<TopNavigationThemingInstance
			customTheme={{ backgroundColor: parseHex('#000448'), highlightColor: parseHex('#6FF2B4') }}
		/>
	</WithResponsiveViewport>
);

export const TopNavigationThemingSingleExampleCustomLogo = () => (
	<WithResponsiveViewport>
		<TopNavigationThemingInstance
			customTheme={{ backgroundColor: parseHex('#000448'), highlightColor: parseHex('#6FF2B4') }}
			useCustomLogo
		/>
	</WithResponsiveViewport>
);

export const TopNavigationThemingRGBExample = () => (
	<WithResponsiveViewport>
		<TopNavigationThemingInstance
			customTheme={{
				backgroundColor: parseRgb('rgb(200, 100, 0)'),
				highlightColor: parseRgb('rgb(0, 33, 66)'),
			}}
		/>
	</WithResponsiveViewport>
);

export const TopNavigationThemingHSLExample = () => (
	<WithResponsiveViewport>
		<TopNavigationThemingInstance
			customTheme={{
				backgroundColor: parseHsl('hsl(90deg, 75%, 25%)'),
				highlightColor: parseHsl('hsl(270deg, 66%, 33%)'),
			}}
		/>
	</WithResponsiveViewport>
);

export default TopNavigationThemingExample;
