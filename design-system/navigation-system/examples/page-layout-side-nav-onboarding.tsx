/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import AppsIcon from '@atlaskit/icon/core/apps';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavToggleButton,
	useExpandSideNav,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	AppSwitcher,
	CreateButton,
	Help,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

const bannerStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
});

// This is a separate component so it can access the side nav visibility context through `useExpandSideNav`
function LaunchSpotlightButton({ onClick }: { onClick: () => void }) {
	const expandSideNav = useExpandSideNav();

	const handleLaunchSpotlight = useCallback(() => {
		expandSideNav();
		onClick();
	}, [onClick, expandSideNav]);

	return <Button onClick={handleLaunchSpotlight}>Launch spotlight</Button>;
}

export default function SideNavOnboardingExample() {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);

	return (
		<WithResponsiveViewport>
			<SpotlightManager>
				<Root>
					<Banner xcss={bannerStyles.root}> </Banner>
					<TopNav>
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
					<SideNav
						onExpand={() => console.log('onExpand')}
						onCollapse={() => console.log('onCollapse')}
					>
						<SideNavContent>
							<MenuList>
								<SpotlightTarget name="your-work">
									<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
										Your work
									</LinkMenuItem>
								</SpotlightTarget>
								<LinkMenuItem href="#" elemBefore={<AppsIcon label="" color="currentColor" />}>
									Apps
								</LinkMenuItem>
								<LinkMenuItem href="#" elemBefore={<ProjectIcon label="" color="currentColor" />}>
									Projects
								</LinkMenuItem>
							</MenuList>
						</SideNavContent>
						<PanelSplitter label="Resize side nav" />
					</SideNav>
					<Main id="main-container">
						<Stack space="space.100" xcss={headingStyles.root}>
							<Heading size="small">Project Blueshift</Heading>
							<Inline space="space.100">
								<LaunchSpotlightButton onClick={() => setIsSpotlightActive(true)} />
							</Inline>
						</Stack>
					</Main>
				</Root>

				<SpotlightTransition>
					{isSpotlightActive && (
						<Spotlight
							actions={[
								{
									onClick: () => setIsSpotlightActive(false),
									text: 'OK',
								},
							]}
							heading="Welcome to your work"
							target="your-work"
							key="your-work"
						>
							This is where you can browse items you've recently been assigned, worked on, viewed,
							or starred.
						</Spotlight>
					)}
				</SpotlightTransition>
			</SpotlightManager>
		</WithResponsiveViewport>
	);
}
