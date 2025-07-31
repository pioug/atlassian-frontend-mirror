/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useReducer, useState } from 'react';

import { jsx } from '@compiled/react';

import AKBadge from '@atlaskit/badge';
import { Label } from '@atlaskit/form';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Main, Root, SideNav } from '@atlaskit/navigation-system';
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
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';

// TODO: consider exposing this type properly, but it isn't needed for normal usage
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { type CustomTheme } from '../src/ui/top-nav-items/themed/get-custom-theme-styles';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

const Badge = () => <AKBadge appearance="important">{5}</AKBadge>;

const TopNavigation = ({ customTheme }: { customTheme?: CustomTheme }) => {
	const [isAppSwitcherSelected, toggleIsAppSwitcherSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);
	const [isChatSelected, toggleIsChatSelected] = useReducer((isSelected) => !isSelected, true);
	const [isNotificationsSelected, toggleIsNotificationsSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);
	const [isHelpSelected, toggleIsHelpSelected] = useReducer((isSelected) => !isSelected, false);
	const [isSettingsSelected, toggleIsSettingsSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);
	const [isProfileSelected, toggleIsProfileSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);

	return (
		<TopNav UNSAFE_theme={customTheme}>
			<TopNavStart>
				<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				<AppSwitcher
					label="App switcher"
					onClick={toggleIsAppSwitcherSelected}
					isSelected={isAppSwitcherSelected}
				/>
				<AppLogo
					href="http://www.atlassian.design"
					icon={ConfluenceIcon}
					name="Confluence"
					label="Home page"
				/>
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
	);
};

export const TopNavigationThemingWithPickerExample = () => {
	const [backgroundColor, setColor] = useState('#FFFFFF');

	return (
		<WithResponsiveViewport>
			<Root>
				<TopNavigation customTheme={{ backgroundColor, highlightColor: '#d8388a' }} />
				<SideNav>Hello world</SideNav>
				<Main>
					<Label htmlFor="background-color">Background color</Label>
					<input
						type="color"
						id="background-color"
						value={backgroundColor}
						onChange={(e) => setColor(e.currentTarget.value)}
					/>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
};

export default TopNavigationThemingWithPickerExample;
