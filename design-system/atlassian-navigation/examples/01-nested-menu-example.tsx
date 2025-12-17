/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, type KeyboardEvent, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import {
	AtlassianNavigation,
	PrimaryButton,
	PrimaryDropdownButton,
	ProductHome,
	Settings,
} from '@atlaskit/atlassian-navigation';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { type PopupProps } from '@atlaskit/popup/types';

const ProductHomeExample = () => (
	<ProductHome onClick={console.log} icon={JiraIcon} logo={JiraLogo} siteTitle="Hello" />
);

const ProjectsContent = () => (
	<MenuGroup>
		<Section title="Starred">
			<ButtonItem>Mobile Research</ButtonItem>
			<ButtonItem testId="it-services">IT Services</ButtonItem>
		</Section>
		<Section hasSeparator title="Recent">
			<ButtonItem>Engineering Leadership</ButtonItem>
			<ButtonItem>BAU</ButtonItem>
			<ButtonItem>Hardware Support</ButtonItem>
			<ButtonItem>New Features</ButtonItem>
			<ButtonItem>SAS</ButtonItem>
		</Section>
		<Section hasSeparator>
			<ButtonItem>View all projects</ButtonItem>
		</Section>
	</MenuGroup>
);

const DashboardsContent = () => (
	<MenuGroup>
		<Section title="Starred">
			<ButtonItem>System dashboard</ButtonItem>
			<ButtonItem>Innovation week</ButtonItem>
		</Section>
		<Section hasSeparator title="Recent">
			<ButtonItem>Vanguard</ButtonItem>
			<ButtonItem>Pearformance</ButtonItem>
			<ButtonItem>Vertigo</ButtonItem>
		</Section>
		<Section hasSeparator>
			<ButtonItem>View all dashboards</ButtonItem>
		</Section>
	</MenuGroup>
);

const AppsContent = () => (
	<MenuGroup>
		<Section title="Third Party">
			<ButtonItem>Portfolio</ButtonItem>
			<ButtonItem>Tempo timesheets</ButtonItem>
			<ButtonItem>Slack</ButtonItem>
			<ButtonItem>Invision</ButtonItem>
		</Section>
		<Section hasSeparator>
			<ButtonItem>Explore apps</ButtonItem>
		</Section>
	</MenuGroup>
);

type PrimaryDropdownProps = {
	content: PopupProps['content'];
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	isHighlighted?: boolean;
};

const PrimaryDropdown = (props: PrimaryDropdownProps) => {
	const { content, text, isHighlighted } = props;
	const [isOpen, setIsOpen] = useState(false);
	const onClick = () => {
		setIsOpen(!isOpen);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === 'ArrowDown') {
			setIsOpen(true);
		}
	};

	return (
		<Popup
			shouldRenderToParent
			content={content}
			isOpen={isOpen}
			onClose={onClose}
			placement="bottom-start"
			testId={`${text}-popup`}
			trigger={(triggerProps) => (
				<PrimaryDropdownButton
					onClick={onClick}
					onKeyDown={onKeyDown}
					isHighlighted={isHighlighted}
					isSelected={isOpen}
					testId={`${text}-popup-trigger`}
					{...triggerProps}
				>
					{text}
				</PrimaryDropdownButton>
			)}
		/>
	);
};

const primaryItems = [
	<PrimaryButton
		href="http://www.atlassian.com"
		onClick={(e) => {
			if (e.ctrlKey || e.metaKey) {
				return;
			}
			e.preventDefault();
			console.log('onClick fired');
		}}
	>
		Home
	</PrimaryButton>,
	<PrimaryButton
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		Your work
	</PrimaryButton>,
	<PrimaryButton
		onClick={(...args: any[]) => {
			console.log('Workspaces', ...args);
		}}
	>
		Workspaces
	</PrimaryButton>,
	<PrimaryButton
		onClick={(...args: any[]) => {
			console.log('Teams', ...args);
		}}
	>
		Teams
	</PrimaryButton>,
	<PrimaryButton
		onClick={(...args: any[]) => {
			console.log('Plans', ...args);
		}}
	>
		Plans
	</PrimaryButton>,
	<PrimaryButton
		onClick={(...args: any[]) => {
			console.log('Alerts', ...args);
		}}
	>
		Alerts
	</PrimaryButton>,
	<PrimaryButton
		onClick={(...args: any[]) => {
			console.log('Filters', ...args);
		}}
	>
		Filters
	</PrimaryButton>,
	<PrimaryDropdown content={ProjectsContent} text="Projects" />,
	<PrimaryDropdown content={DashboardsContent} text="Dashboards" />,
	<PrimaryDropdown content={AppsContent} text="Apps" />,
];

const settings = 'Settings drawer';
const SettingsDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		setIsOpen(!isOpen);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<Fragment>
			<Settings isSelected={isOpen} onClick={onClick} tooltip="Settings" />
			<Drawer label={settings} isOpen={isOpen} onClose={onClose}>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>{settings}</DrawerContent>
			</Drawer>
		</Fragment>
	);
};

const NestedMenuExample = (): React.JSX.Element => (
	<div>
		<p>To display nested menu, click 'More' button</p>
		<AtlassianNavigation
			label="site"
			moreLabel="More"
			primaryItems={primaryItems}
			renderProductHome={ProductHomeExample}
			renderSettings={SettingsDrawer}
		/>
	</div>
);

export default NestedMenuExample;
