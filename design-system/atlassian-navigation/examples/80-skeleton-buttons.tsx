/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type KeyboardEvent, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	AtlassianNavigation,
	PrimaryButton,
	PrimaryDropdownButton,
	ProductHome,
	Settings,
	useOverflowStatus,
} from '@atlaskit/atlassian-navigation';
import {
	SkeletonCreateButton,
	SkeletonIconButton,
	SkeletonPrimaryButton,
} from '@atlaskit/atlassian-navigation/skeleton';
import { SkeletonHelpButton } from '@atlaskit/atlassian-navigation/skeleton-help-button';
import { SkeletonNotificationButton } from '@atlaskit/atlassian-navigation/skeleton-notification-button';
import { SkeletonSettingsButton } from '@atlaskit/atlassian-navigation/skeleton-settings-button';
import { SkeletonSwitcherButton } from '@atlaskit/atlassian-navigation/skeleton-switcher-button';
import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import Link from '@atlaskit/link';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { type PopupProps } from '@atlaskit/popup/types';
import { token } from '@atlaskit/tokens';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import { avatarUrl, ProfilePopup } from './shared/profile-popup';
import { SwitcherPopup } from './shared/switcher-popup';
import { theme } from './shared/themes';

const drawerLabelText = {
	settings: 'Settings drawer',
};

const { settings } = drawerLabelText;

const paragraphStyles = css({
	padding: `${token('space.100', '8px')} ${token('space.200', '16px')}`,
});

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

const FiltersContent = () => (
	<MenuGroup>
		<Section title="Starred">
			<ButtonItem>Assigned to me</ButtonItem>
			<ButtonItem>Created by me</ButtonItem>
			<ButtonItem>Updated recently</ButtonItem>
		</Section>
		<Section hasSeparator title="Recent">
			<ButtonItem>Engineering Leadership</ButtonItem>
			<ButtonItem>Viewed recently</ButtonItem>
			<ButtonItem>Resolved recently</ButtonItem>
			<ButtonItem>Tasks done</ButtonItem>
		</Section>
		<Section hasSeparator>
			<ButtonItem>View all filters</ButtonItem>
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
	const { isVisible, closeOverflowMenu } = useOverflowStatus();
	const [isOpen, setIsOpen] = useState(false);
	const onDropdownItemClick = () => {
		console.log(
			'Programmatically closing the menu, even though the click happens inside the popup menu.',
		);
		closeOverflowMenu();
	};

	if (!isVisible) {
		return (
			<ButtonItem testId={text} onClick={onDropdownItemClick}>
				{text}
			</ButtonItem>
		);
	}

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

const SkeletonCreate = () => <SkeletonCreateButton text="Create"></SkeletonCreateButton>;
const SkeletonProfileButton = () => (
	<SkeletonIconButton>
		<img src={avatarUrl} alt="Your profile and settings" />
	</SkeletonIconButton>
);
const skeletonPrimaryItems = [
	<SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
	<SkeletonPrimaryButton isDropdownButton text="Projects" />,
	<SkeletonPrimaryButton isDropdownButton isHighlighted text="Filters &amp; work items" />,
	<SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
	<SkeletonPrimaryButton isDropdownButton text="Apps" testId="apps-skeleton" />,
];
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
	<PrimaryDropdown content={ProjectsContent} text="Projects" />,
	<PrimaryDropdown isHighlighted content={FiltersContent} text="Filters &amp; work items" />,
	<PrimaryDropdown content={DashboardsContent} text="Dashboards" />,
	<PrimaryDropdown content={AppsContent} text="Apps" />,
];

const JiraIntegrationWithSkeletonButtonsExample = () => {
	const [shouldUseSkeletons, setShoulUseSkeletons] = useState(true);
	const [themeIndex, setThemeIndex] = useState(0);

	return (
		<Fragment>
			<AtlassianNavigation
				label="site"
				moreLabel="More"
				primaryItems={shouldUseSkeletons ? skeletonPrimaryItems : primaryItems}
				renderAppSwitcher={
					shouldUseSkeletons
						? () => <SkeletonSwitcherButton label="switcher button" />
						: SwitcherPopup
				}
				renderCreate={shouldUseSkeletons ? SkeletonCreate : DefaultCreate}
				renderProductHome={() => (
					<ProductHome
						icon={JiraIcon}
						logo={JiraLogo}
						siteTitle="Hello"
						onClick={shouldUseSkeletons ? undefined : console.log}
					/>
				)}
				renderProfile={shouldUseSkeletons ? SkeletonProfileButton : ProfilePopup}
				renderSettings={
					shouldUseSkeletons
						? () => <SkeletonSettingsButton label="settings button" />
						: SettingsDrawer
				}
				renderHelp={
					shouldUseSkeletons ? () => <SkeletonHelpButton label="help button" /> : HelpPopup
				}
				renderNotifications={
					shouldUseSkeletons
						? () => <SkeletonNotificationButton label="notifications button" />
						: NotificationsPopup
				}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				theme={theme[themeIndex]}
				testId="atlassian-navigation"
			/>
			<p css={paragraphStyles}>
				<Button testId="toggle-skeleton" onClick={() => setShoulUseSkeletons(!shouldUseSkeletons)}>
					Use {shouldUseSkeletons ? 'regular ' : 'skeleton '} buttons
				</Button>
			</p>
			<p css={paragraphStyles}>
				<Button
					testId="change-theme"
					onClick={() => setThemeIndex((themeIndex + 1) % theme.length)}
				>
					Change theme
				</Button>
			</p>
			<p>
				SkeletonButtons are different to the other{' '}
				<Link href="https://atlaskit.atlassian.com/examples/navigation/atlassian-navigation/themed-skeleton-example">
					Skeleton components
				</Link>
				. They are a light-weight, single HTML button element with some CSS that represents their
				more heavy interactive counterparts.
			</p>
		</Fragment>
	);
};

export default JiraIntegrationWithSkeletonButtonsExample;
