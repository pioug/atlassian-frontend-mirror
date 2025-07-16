/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ShrinkDiagonalIcon from '@atlaskit/icon/core/shrink-diagonal';
import {
	LinkMenuItem,
	Main,
	MenuList,
	Root,
	Search,
	SideNav,
	SideNavContent,
} from '@atlaskit/navigation-system';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppSwitcher,
	CreateButton,
	Help,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

// TODO: consider exposing this type properly, but it isn't needed for normal usage
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { type CustomTheme } from '../src/ui/top-nav-items/themed/get-custom-theme-styles';

import { WithResponsiveViewport } from './utils/example-utils';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

const customTheme: CustomTheme = { backgroundColor: '#ff8160', highlightColor: '#d8388a' };

function MainContentBorderExample({
	isCustomThemeEnabled: defaultIsCustomThemeEnabled = true,
	isSideNavCollapsed: defaultIsSideNavCollapsed = false,
	defaultIsFullScreen = false,
}: {
	isCustomThemeEnabled?: boolean;
	isSideNavCollapsed?: boolean;
	defaultIsFullScreen?: boolean;
}) {
	const [isCustomThemeEnabled, setIsCustomThemeEnabled] = useState(defaultIsCustomThemeEnabled);
	const [isFullscreen, setIsFullscreen] = useState(defaultIsFullScreen);

	return (
		<WithResponsiveViewport>
			<Root>
				{!isFullscreen && (
					<TopNav UNSAFE_theme={isCustomThemeEnabled ? customTheme : undefined}>
						<TopNavStart>
							<SideNavToggleButton
								testId="side-nav-toggle-button"
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
							/>
							<AppSwitcher label="Switch apps" />
						</TopNavStart>
						<TopNavMiddle>
							<Search label="Search" />
							<CreateButton>Create</CreateButton>
						</TopNavMiddle>
						<TopNavEnd>
							<Help label="Help" />
							<Settings label="Settings" />
						</TopNavEnd>
					</TopNav>
				)}

				{!isFullscreen && (
					<SideNav defaultCollapsed={defaultIsSideNavCollapsed}>
						<SideNavContent>
							<MenuList>
								<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
									Your work
								</LinkMenuItem>
							</MenuList>
						</SideNavContent>
					</SideNav>
				)}
				<Main>
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="small">Project Blueshift</Heading>
						<Inline space="space.100">
							<Button
								isSelected={isCustomThemeEnabled}
								onClick={() => setIsCustomThemeEnabled((prev) => !prev)}
							>
								Toggle custom theme
							</Button>
							<Button
								isSelected={isFullscreen}
								onClick={() => setIsFullscreen((prev) => !prev)}
								iconBefore={isFullscreen ? ShrinkDiagonalIcon : GrowDiagonalIcon}
							>
								Toggle full screen
							</Button>
						</Inline>
					</Stack>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

export function MainContentBorderThemingEnabledVR() {
	return <MainContentBorderExample isCustomThemeEnabled isSideNavCollapsed={false} />;
}

export function MainContentBorderThemingDisabledVR() {
	return <MainContentBorderExample isCustomThemeEnabled={false} isSideNavCollapsed={false} />;
}

export function MainContentBorderThemingEnabledSideNavCollapsedVR() {
	return <MainContentBorderExample isCustomThemeEnabled isSideNavCollapsed />;
}

export function MainContentBorderThemingDisabledSideNavCollapsedVR() {
	return <MainContentBorderExample isCustomThemeEnabled={false} isSideNavCollapsed />;
}

export function MainContentBorderThemingEnabledFullScreenVR() {
	return (
		<MainContentBorderExample isCustomThemeEnabled isSideNavCollapsed={false} defaultIsFullScreen />
	);
}

export default MainContentBorderExample;
