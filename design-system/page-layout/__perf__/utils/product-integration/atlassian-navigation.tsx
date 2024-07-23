/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type MouseEvent, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// AFP-1799 storybook examples in src cause issues
import {
	AtlassianNavigation,
	PrimaryButton,
	ProductHome,
	Search,
	Settings,
} from '@atlaskit/atlassian-navigation';
import Drawer from '@atlaskit/drawer';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import { DefaultCreate } from './create';
import { HelpPopup } from './help-popup';
import { NotificationsPopup } from './notifications-popup';
import { ProfilePopup } from './profile-popup';

const drawerLabelText = {
	search: 'Search drawer',
	settings: 'Settings drawer',
};

const { search, settings } = drawerLabelText;

const ProductHomeExample = () => (
	<ProductHome icon={JiraIcon} logo={JiraLogo} siteTitle="Extranet" />
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
			<Search
				onClick={onClick}
				testId="nav-search"
				placeholder="Search..."
				tooltip="Search"
				label="Search"
			/>
			<Drawer label={search} isOpen={isOpen} onClose={onClose}>
				<div>{search}</div>
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

const buttonClick = (toLog: string) => (e: MouseEvent<HTMLElement | HTMLAnchorElement>) => {
	if (e.ctrlKey || e.metaKey) {
		return;
	}
	e.preventDefault();
};

const primaryItems = [
	<PrimaryButton onClick={buttonClick('Projects')}>Projects</PrimaryButton>,
	<PrimaryButton onClick={buttonClick('Filters')} isHighlighted>
		Filters
	</PrimaryButton>,
	<PrimaryButton onClick={buttonClick('Dashboards')}>Dashboards</PrimaryButton>,
	<PrimaryButton onClick={buttonClick('Apps')}>Apps</PrimaryButton>,
];

const PerfExample = () => (
	<Fragment>
		<AtlassianNavigation
			label="site"
			moreLabel="More"
			primaryItems={primaryItems}
			renderCreate={DefaultCreate}
			renderHelp={HelpPopup}
			renderNotifications={NotificationsPopup}
			renderProductHome={ProductHomeExample}
			renderProfile={ProfilePopup}
			renderSearch={SearchDrawer}
			renderSettings={SettingsDrawer}
		/>
	</Fragment>
);

export default PerfExample;
