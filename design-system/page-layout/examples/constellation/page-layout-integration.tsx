/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Create } from '@atlaskit/atlassian-navigation/create';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Help } from '@atlaskit/atlassian-navigation/help';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { PrimaryButton } from '@atlaskit/atlassian-navigation/primary-button';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import noop from '@atlaskit/ds-lib/noop';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { ConfluenceLogoCS as ConfluenceLogo } from '@atlaskit/logo/confluence/logo';
import ButtonItem from '@atlaskit/menu/button-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Content } from '@atlaskit/page-layout/content';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { LeftSidebar } from '@atlaskit/page-layout/left-sidebar';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Main } from '@atlaskit/page-layout/main';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { PageLayout } from '@atlaskit/page-layout/page-layout';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { TopNavigation } from '@atlaskit/page-layout/top-navigation';
import { Popup } from '@atlaskit/popup/popup';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Header } from '@atlaskit/side-navigation/header';
import { NavigationHeader } from '@atlaskit/side-navigation/navigation-header';
import { NestableNavigationContent } from '@atlaskit/side-navigation/nestable-navigation-content';
import { NestingItem } from '@atlaskit/side-navigation/nesting-item';
import { SideNavigation } from '@atlaskit/side-navigation/side-navigation';

import { SlotLabel, SlotWrapper } from '../common';

export default function ProductLayout(): jsx.JSX.Element {
	return (
		<PageLayout>
			<TopNavigation
				isFixed={true}
				id="confluence-navigation"
				skipLinkTitle="Confluence Navigation"
			>
				<TopNavigationContents />
			</TopNavigation>
			<Content testId="content">
				<LeftSidebar
					isFixed={false}
					width={450}
					id="project-navigation"
					skipLinkTitle="Project Navigation"
					testId="left-sidebar"
					resizeGrabAreaLabel="Resize Current project sidebar"
					resizeButtonLabel="Current project sidebar"
					valueTextLabel="Width"
				>
					<SideNavigationContent />
				</LeftSidebar>
				<Main id="main-content" skipLinkTitle="Main Content">
					<SlotWrapper>
						<SlotLabel>Main Content</SlotLabel>
					</SlotWrapper>
				</Main>
			</Content>
		</PageLayout>
	);
}

function TopNavigationContents() {
	return (
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
			renderCreate={DefaultCreate}
			renderHelp={HelpPopup}
		/>
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
				</Section>
			</NestableNavigationContent>
		</SideNavigation>
	);
};

/*
 * Components for composing top and side navigation
 */

export const DefaultCreate = (): jsx.JSX.Element => (
	<Create buttonTooltip="Create" iconButtonTooltip="Create" onClick={noop} text="Create" />
);

const ProductHomeExample = () => (
	<ProductHome onClick={console.log} icon={ConfluenceIcon} logo={ConfluenceLogo} siteTitle="App" />
);

export const HelpPopup = (): jsx.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		setIsOpen(!isOpen);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<Popup
			shouldRenderToParent
			placement="bottom-start"
			content={HelpPopupContent}
			isOpen={isOpen}
			onClose={onClose}
			trigger={(triggerProps) => (
				<Help isSelected={isOpen} onClick={onClick} tooltip="Help" {...triggerProps} />
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
