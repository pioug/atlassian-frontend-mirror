/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type KeyboardEvent, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import Drawer from '@atlaskit/drawer';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { Label } from '@atlaskit/form';
import EditorAddIcon from '@atlaskit/icon/glyph/add';
import EditorPeopleIcon from '@atlaskit/icon/glyph/people-group';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { type PopupProps } from '@atlaskit/popup/types';
import { Box } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import {
	AtlassianNavigation,
	PrimaryButton,
	PrimaryDropdownButton,
	ProductHome,
	Search,
	Settings,
} from '../src';
import { useOverflowStatus } from '../src/controllers/overflow';

import { DefaultCreate } from './shared/create';
import { HelpPopup } from './shared/help-popup';
import { NotificationsPopup } from './shared/notifications-popup';
import { ProfilePopup } from './shared/profile-popup';
import { SwitcherPopup } from './shared/switcher-popup';

const drawerLabelText = {
	search: 'Search drawer',
	settings: 'Settings drawer',
};

interface SearchDropdownItemProps {
	setFilteredOptions: React.Dispatch<React.SetStateAction<{ label: string; value: string }[]>>;
	filteredOptions: { label: string; value: string }[];
}

const searchOptions = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
	{ label: 'Option 3', value: 'option3' },
];

const { search, settings } = drawerLabelText;

const ProductHomeExample = () => (
	<ProductHome onClick={console.log} icon={JiraIcon} logo={JiraLogo} siteTitle="Hello" />
);

const SearchDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		setIsOpen(!isOpen);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<Fragment>
			<Search onClick={onClick} placeholder="Search..." tooltip="Search" label="Search" />
			<Drawer label={search} isOpen={isOpen} onClose={onClose}>
				{search}
			</Drawer>
		</Fragment>
	);
};

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
				{settings}
			</Drawer>
		</Fragment>
	);
};

const SearchDropdownItem = ({ setFilteredOptions, filteredOptions }: SearchDropdownItemProps) => {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchText = e.target.value.toLowerCase();
		const filteredItems = searchOptions.filter((option) =>
			option.label.toLowerCase().includes(searchText),
		);
		setFilteredOptions(filteredItems);
	};

	return (
		<Box>
			<Box paddingInline="space.200">
				<Label htmlFor="basic-textfield">Filter menu items</Label>
				<Textfield onChange={handleSearchChange} name="basic" id="basic-textfield" />
			</Box>
		</Box>
	);
};

const SearchableDropdown = () => {
	const [filteredOptions, setFilteredOptions] = useState(searchOptions);
	return (
		<Box>
			<Box role="menu">
				{filteredOptions.map((filteredOption) => (
					<DropdownItem key={filteredOption.value}>{filteredOption.label}</DropdownItem>
				))}
			</Box>
			<SearchDropdownItem
				filteredOptions={filteredOptions}
				setFilteredOptions={setFilteredOptions}
			/>
		</Box>
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
			<ButtonItem>Done issues</ButtonItem>
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

const OptionsContent = () => (
	<MenuGroup>
		<Box role="menu" paddingBlock="space.200">
			<HeadingItem>Help</HeadingItem>
			<DropdownItem elemBefore={<Avatar size="small" />}>Michal</DropdownItem>
			<DropdownItem elemBefore={<Avatar size="small" />}>Alex</DropdownItem>
			<DropdownItem elemBefore={<Avatar size="small" />}>Stefana</DropdownItem>
		</Box>
		<Box role="menu" paddingBlock="space.200">
			<HeadingItem>Your collaborators</HeadingItem>
			<DropdownItem elemAfter={<EditorAddIcon label="" />}>Invite collaborator</DropdownItem>
			<DropdownItem elemAfter={<EditorPeopleIcon label="" />}>Create team</DropdownItem>
		</Box>
		<Box paddingBlock="space.200">
			<HeadingItem>Filter menu</HeadingItem>
			<SearchableDropdown />
		</Box>
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
	<PrimaryDropdown content={ProjectsContent} text="Projects" />,
	<PrimaryDropdown isHighlighted content={FiltersContent} text="Filters &amp; issues" />,
	<PrimaryDropdown content={DashboardsContent} text="Dashboards" />,
	<PrimaryDropdown content={AppsContent} text="Apps" />,
	<PrimaryDropdown content={OptionsContent} text="Options" />,
];

const JiraIntegrationExample = () => (
	<Fragment>
		<AtlassianNavigation
			label="site"
			moreLabel="More"
			primaryItems={primaryItems}
			renderAppSwitcher={SwitcherPopup}
			renderCreate={DefaultCreate}
			renderHelp={HelpPopup}
			renderNotifications={NotificationsPopup}
			renderProductHome={ProductHomeExample}
			renderProfile={ProfilePopup}
			renderSearch={SearchDrawer}
			renderSettings={SettingsDrawer}
		/>
		<p>
			To display Notifications, ensure you're logged in to
			https://id.stg.internal.atlassian.com/login
		</p>
	</Fragment>
);

export default JiraIntegrationExample;
