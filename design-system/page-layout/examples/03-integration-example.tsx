/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	AppSwitcher,
	AtlassianNavigation,
	Create,
	Help,
	PrimaryButton,
	ProductHome,
} from '@atlaskit/atlassian-navigation';
import Button from '@atlaskit/button/new';
import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/logo';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import {
	Header,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	SideNavigation,
} from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Content, LeftSidebar, Main, PageLayout, RightPanel, TopNavigation } from '../src';

import { ExpandLeftSidebarKeyboardShortcut, SlotLabel, SlotWrapper } from './common';

const centeredStyles = css({ textAlign: 'center' });
const mainContentStyles = css({
	height: '2000px',
	backgroundColor: token('color.background.neutral'),
});

export default function ProductLayout() {
	const [rightPanelWidth, setRightPanelWidth] = useState(0);
	const toggle = useCallback(() => setRightPanelWidth((c) => (c > 0 ? 0 : 360)), []);
	const close = useCallback(() => setRightPanelWidth(0), []);

	const TriggerHelp = useCallback(
		() => <Help isSelected={rightPanelWidth !== 0} onClick={toggle} tooltip="Help" />,
		[rightPanelWidth, toggle],
	);

	return (
		<PageLayout>
			<TopNavigation id="confluence-navigation" skipLinkTitle="Confluence Navigation">
				<AtlassianNavigation
					label="site"
					moreLabel="More"
					primaryItems={[
						<PrimaryButton isHighlighted>Item 1</PrimaryButton>,
						<PrimaryButton>Item 2</PrimaryButton>,
						<PrimaryButton>Item 3</PrimaryButton>,
						<PrimaryButton>Item 4</PrimaryButton>,
					]}
					renderProductHome={ProductHomeExample}
					renderAppSwitcher={() => <AppSwitcher tooltip="Switch to..." />}
					renderCreate={DefaultCreate}
					renderHelp={TriggerHelp}
				/>
			</TopNavigation>
			<Content testId="content">
				<LeftSidebar
					isFixed={true}
					width={450}
					id="project-navigation"
					skipLinkTitle="Current project sidebar"
					testId="left-sidebar"
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={{
						ResizeButton: {
							render: (Component, props) => (
								<Tooltip
									content={'Use [ to show or hide the sidebar'}
									hideTooltipOnClick
									position="right"
									testId="tooltip"
								>
									<Component {...props} />
								</Tooltip>
							),
						},
					}}
				>
					<SideNavigationContent />
					<ExpandLeftSidebarKeyboardShortcut />
				</LeftSidebar>
				<Main id="main-content" skipLinkTitle="Main Content">
					<div css={mainContentStyles}>
						<h3 css={centeredStyles}>Main Content</h3>
					</div>
				</Main>
			</Content>
			<RightPanel
				testId="rightPanel"
				id="right-panel"
				skipLinkTitle="Right Panel"
				isFixed
				width={rightPanelWidth}
			>
				<SlotWrapper
					borderColor={token('color.border.accent.orange')}
					backgroundColor={token('elevation.surface.overlay')}
				>
					<SlotLabel>Help Panel</SlotLabel>
					<Button type="button" onClick={close}>
						Close Panel
					</Button>
				</SlotWrapper>
			</RightPanel>
		</PageLayout>
	);
}

const SideNavigationContent = () => {
	return (
		<SideNavigation label="Project navigation" testId="side-navigation">
			<NavigationHeader>
				<Header description="Sidebar header description">Sidebar Header</Header>
			</NavigationHeader>
			<NestableNavigationContent initialStack={[]}>
				<Section>
					<NestingItem id="1" title="Nested Item">
						<Section title="Group 1">
							<ButtonItem>Item 1</ButtonItem>
							<ButtonItem>Item 2</ButtonItem>
						</Section>
					</NestingItem>

					<Section title="Group 2">
						{Array.from({ length: 30 })
							.fill(undefined)
							.map((_, i) => (
								<ButtonItem key={i + 1}>Atlassian SideNavigation: This is item {i + 1}</ButtonItem>
							))}
					</Section>
				</Section>
			</NestableNavigationContent>
		</SideNavigation>
	);
};

/*
 * Components for composing top and side navigation
 */

export const DefaultCreate = () => (
	<Create buttonTooltip="Create" iconButtonTooltip="Create" onClick={console.log} text="Create" />
);

const ProductHomeExample = () => (
	<ProductHome
		onClick={console.log}
		icon={ConfluenceIcon}
		logo={ConfluenceLogo}
		siteTitle="Product"
	/>
);

export const HelpPopup = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = useCallback(() => setIsOpen((c) => !c), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<Popup
			placement="bottom-start"
			content={HelpPopupContent}
			isOpen={isOpen}
			onClose={close}
			trigger={(triggerProps) => (
				<Help isSelected={isOpen} onClick={toggle} tooltip="Help" {...triggerProps} />
			)}
		/>
	);
};

const HelpPopupContent = () => (
	<MenuGroup>
		<Section title={'Menu Heading'}>
			<ButtonItem>Item 1</ButtonItem>
			<ButtonItem>Item 2</ButtonItem>
			<ButtonItem>Item 3</ButtonItem>
			<ButtonItem>Item 4</ButtonItem>
		</Section>
		<Section title="Menu Heading with separator" hasSeparator>
			<ButtonItem>Item 5</ButtonItem>
			<ButtonItem>Item 6</ButtonItem>
		</Section>
	</MenuGroup>
);
