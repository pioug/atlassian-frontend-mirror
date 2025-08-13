/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import AppsIcon from '@atlaskit/icon/core/apps';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import { MenuList } from '@atlaskit/navigation-system';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import {
	AppSwitcher,
	CreateButton,
	Help,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

const asideStyles = cssMap({
	root: { backgroundColor: token('elevation.surface.sunken') },
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		height: '100%',
	},
});

const panelStyles = cssMap({
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
		height: '100%',
	},
});

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

export function PanelAsideDefaultWidthsVR() {
	return <PanelAsideDefaultWidths />;
}

export function PanelAsideZeroWidthsVR() {
	return <PanelAsideDefaultWidths defaultPanelWidth={0} defaultAsideWidth={0} />;
}

/**
 * This example demonstrates that the `defaultWidth` prop of `Panel` and `Aside` support being used to "hide" the slots,
 * _as a temporary stopgap to support Jira's usage in this way_.
 */
export default function PanelAsideDefaultWidths({
	defaultPanelWidth = 350,
	defaultAsideWidth = 400,
}: {
	/**
	 * The default width to use for the panel slot in the test.
	 */
	defaultPanelWidth?: number;
	/**
	 * The default width to use for the aside slot in the test.
	 */
	defaultAsideWidth?: number;
}) {
	const [isPanelRendered, setIsPanelRendered] = useState(true);
	const [isAsideRendered, setIsAsideRendered] = useState(true);

	const [panelWidth, setPanelWidth] = useState(defaultPanelWidth);
	const [asideWidth, setAsideWidth] = useState(defaultAsideWidth);

	return (
		<WithResponsiveViewport>
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
							<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
								Your work
							</LinkMenuItem>
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
						<Stack alignInline="start">
							<Button
								isSelected={isAsideRendered}
								onClick={() => setIsAsideRendered((prev) => !prev)}
							>
								Render Aside
							</Button>
							<Button
								isSelected={isPanelRendered}
								onClick={() => setIsPanelRendered((prev) => !prev)}
							>
								Render Panel
							</Button>
							<Button
								isDisabled={!isAsideRendered}
								isSelected={asideWidth === 0}
								onClick={() => {
									if (asideWidth === 0) {
										setAsideWidth(defaultAsideWidth);
									} else {
										setAsideWidth(0);
									}
								}}
							>
								Set Aside width to 0
							</Button>
							<Button
								isDisabled={!isPanelRendered}
								isSelected={panelWidth === 0}
								onClick={() => {
									if (panelWidth === 0) {
										setPanelWidth(defaultPanelWidth);
									} else {
										setPanelWidth(0);
									}
								}}
							>
								Set Panel width to 0
							</Button>
						</Stack>
					</Stack>
				</Main>
				{isAsideRendered && (
					<Aside xcss={asideStyles.root} defaultWidth={asideWidth}>
						<Stack space="space.400" xcss={asideStyles.content}>
							<Heading size="small">Aside</Heading>
							<Inline space="space.100">
								<Button>Following</Button>
								<Button>Share</Button>
							</Inline>

							<Stack space="space.050">
								<Heading size="small">Owner</Heading>
								<Text weight="medium">Michael Dougall</Text>
							</Stack>
						</Stack>
						<PanelSplitter label="Resize aside" />
					</Aside>
				)}
				{isPanelRendered && (
					<Panel defaultWidth={panelWidth}>
						<Stack space="space.200" xcss={panelStyles.content}>
							<Heading size="small">Panel</Heading>
							<Stack space="space.050">
								<Text weight="bold">What is an epic?</Text>
								<Text>Learn what an epic is and how it's displayed in Jira.</Text>
							</Stack>
							<Stack space="space.050">
								<Text weight="bold">What are sprints?</Text>
								<Text>
									Find out what sprints are and why your team might want to use them to predict and
									execute your project's work.
								</Text>
							</Stack>
							<Text color="color.link">Show 12 more articles</Text>
						</Stack>
						<PanelSplitter label="Resize panel" />
					</Panel>
				)}
			</Root>
		</WithResponsiveViewport>
	);
}
