import React, { useReducer } from 'react';

import { ConfluenceIcon } from '@atlaskit/logo';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	LogIn,
	SideNavToggleButton,
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system';

// TODO: consider exposing this type properly, but it isn't needed for normal usage
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { type CustomTheme } from '../src/ui/top-nav-items/themed/get-custom-theme-styles';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockRoot } from './utils/mock-root';
import { MockSearch } from './utils/mock-search';

const TopNavigationThemingInstance = ({ customTheme }: { customTheme?: CustomTheme }) => {
	const [isAppSwitcherSelected, toggleIsAppSwitcherSelected] = useReducer(
		(isSelected) => !isSelected,
		false,
	);

	const [isHelpSelected, toggleIsHelpSelected] = useReducer((isSelected) => !isSelected, false);

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
					<Help label="Help" onClick={toggleIsHelpSelected} isSelected={isHelpSelected} />
					<LogIn label="Log in" href="" />
				</TopNavEnd>
			</TopNav>
		</MockRoot>
	);
};

export const TopNavigationThemingLoggedOutExample = () => (
	<WithResponsiveViewport>
		<TopNavigationThemingInstance
			customTheme={{ backgroundColor: '#e8cbd2', highlightColor: '#333' }}
		/>
	</WithResponsiveViewport>
);

export default TopNavigationThemingLoggedOutExample;
