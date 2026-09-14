import React, { type KeyboardEvent, useState } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import {
	PrimaryButton,
	type PrimaryButtonProps,
	PrimaryDropdownButton,
	useOverflowStatus,
} from '@atlaskit/atlassian-navigation';
import ButtonItem from '@atlaskit/menu/button-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';
import { Popup } from '@atlaskit/popup/popup';
import { type PopupProps } from '@atlaskit/popup/types';

const NavigationButton = (props: PrimaryButtonProps) => {
	const { isVisible } = useOverflowStatus();
	if (isVisible) {
		return <PrimaryButton {...props} />;
	} else {
		return <ButtonItem>{props.children}</ButtonItem>;
	}
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

type PrimaryDropdownProps = {
	content: PopupProps['content'];
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	isHighlighted?: boolean;
	isOpen?: boolean;
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

export const bitbucketPrimaryItems: React.JSX.Element[] = [
	<NavigationButton
		key="your-work"
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		Your work
	</NavigationButton>,
	<NavigationButton
		key="workspaces"
		onClick={(...args: any[]) => {
			console.log('Workspaces click', ...args);
		}}
	>
		Workspaces
	</NavigationButton>,
	<NavigationButton
		key="repositories"
		onClick={(...args: any[]) => {
			console.log('Repositories click', ...args);
		}}
	>
		Repositories
	</NavigationButton>,
	<NavigationButton
		key="projects"
		onClick={(...args: any[]) => {
			console.log('Projects click', ...args);
		}}
	>
		Projects
	</NavigationButton>,
	<NavigationButton
		key="pull-requests"
		onClick={(...args: any[]) => {
			console.log('Pull requests click', ...args);
		}}
	>
		Pull requests
	</NavigationButton>,
	<NavigationButton
		key="work-items"
		onClick={(...args: any[]) => {
			console.log('Work items click', ...args);
		}}
	>
		Work items
	</NavigationButton>,
];

export const confluencePrimaryItems: React.JSX.Element[] = [
	<NavigationButton
		key="activity"
		onClick={(...args: any[]) => {
			console.log('Activity click', ...args);
		}}
	>
		Activity
	</NavigationButton>,
	<NavigationButton
		key="your-work"
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		Your work
	</NavigationButton>,
	<NavigationButton
		key="spaces"
		onClick={(...args: any[]) => {
			console.log('Spaces click', ...args);
		}}
	>
		Spaces
	</NavigationButton>,
	<NavigationButton
		key="people"
		onClick={(...args: any[]) => {
			console.log('People click', ...args);
		}}
	>
		People
	</NavigationButton>,
	<NavigationButton
		key="apps"
		onClick={(...args: any[]) => {
			console.log('Apps click', ...args);
		}}
	>
		Apps
	</NavigationButton>,
];

export const jiraPrimaryItems: React.JSX.Element[] = [
	<NavigationButton
		key="your-work"
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		Your work
	</NavigationButton>,
	<PrimaryDropdown key="projects" content={ProjectsContent} text="Projects" />,
	<NavigationButton
		key="filters"
		onClick={(...args: any[]) => {
			console.log('Work items click', ...args);
		}}
		isHighlighted
	>
		Filters
	</NavigationButton>,
	<NavigationButton
		key="dashboards"
		onClick={(...args: any[]) => {
			console.log('Dashboards click', ...args);
		}}
	>
		Dashboards
	</NavigationButton>,
	<NavigationButton
		key="teams"
		onClick={(...args: any[]) => {
			console.log('Teams click', ...args);
		}}
	>
		Teams
	</NavigationButton>,
	<NavigationButton
		key="plans"
		onClick={(...args: any[]) => {
			console.log('Plans click', ...args);
		}}
	>
		Plans
	</NavigationButton>,
	<NavigationButton
		key="assets"
		onClick={(...args: any[]) => {
			console.log('Assets click', ...args);
		}}
	>
		Assets
	</NavigationButton>,
	<NavigationButton
		key="apps"
		onClick={(...args: any[]) => {
			console.log('Apps click', ...args);
		}}
	>
		Apps
	</NavigationButton>,
];

export const jiraPrimaryItemsGerman: React.JSX.Element[] = [
	<NavigationButton
		key="your-work"
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		Ihre Aufgaben
	</NavigationButton>,
	<PrimaryDropdown key="projects" content={ProjectsContent} text="Projekte" />,
	<NavigationButton
		key="filters"
		onClick={(...args: any[]) => {
			console.log('Work items click', ...args);
		}}
		isHighlighted
	>
		Filter
	</NavigationButton>,
	<NavigationButton
		key="dashboards"
		onClick={(...args: any[]) => {
			console.log('Dashboards click', ...args);
		}}
	>
		Dashboards
	</NavigationButton>,
	<NavigationButton
		key="teams"
		onClick={(...args: any[]) => {
			console.log('Teams click', ...args);
		}}
	>
		Teams
	</NavigationButton>,
	<NavigationButton
		key="plans"
		onClick={(...args: any[]) => {
			console.log('Plans click', ...args);
		}}
	>
		Pläne
	</NavigationButton>,
	<NavigationButton
		key="assets"
		onClick={(...args: any[]) => {
			console.log('Assets click', ...args);
		}}
	>
		Assets
	</NavigationButton>,
	<NavigationButton
		key="apps"
		onClick={(...args: any[]) => {
			console.log('Apps click', ...args);
		}}
	>
		Apps
	</NavigationButton>,
];

export const jiraPrimaryItemsSpanish: React.JSX.Element[] = [
	<NavigationButton
		key="your-work"
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		Tu trabajo
	</NavigationButton>,
	<PrimaryDropdown key="projects" content={ProjectsContent} text="Projects" />,
	<NavigationButton
		key="filters"
		onClick={(...args: any[]) => {
			console.log('Work items click', ...args);
		}}
		isHighlighted
	>
		Filtros
	</NavigationButton>,
	<NavigationButton
		key="dashboards"
		onClick={(...args: any[]) => {
			console.log('Dashboards click', ...args);
		}}
	>
		Paneles
	</NavigationButton>,
	<NavigationButton
		key="teams"
		onClick={(...args: any[]) => {
			console.log('Teams click', ...args);
		}}
	>
		Equipos
	</NavigationButton>,
	<NavigationButton
		key="plans"
		onClick={(...args: any[]) => {
			console.log('Plans click', ...args);
		}}
	>
		Planes
	</NavigationButton>,
	<NavigationButton
		key="assets"
		onClick={(...args: any[]) => {
			console.log('Assets click', ...args);
		}}
	>
		Activos
	</NavigationButton>,
	<NavigationButton
		key="apps"
		onClick={(...args: any[]) => {
			console.log('Apps click', ...args);
		}}
	>
		Aplicaciones
	</NavigationButton>,
];

export const jiraPrimaryItemsTurkish: React.JSX.Element[] = [
	<NavigationButton
		key="your-work"
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		Çalışmalarınız
	</NavigationButton>,
	<PrimaryDropdown key="projects" content={ProjectsContent} text="Projeler" />,
	<NavigationButton
		key="filters"
		onClick={(...args: any[]) => {
			console.log('Work items click', ...args);
		}}
		isHighlighted
	>
		Filtreler
	</NavigationButton>,
	<NavigationButton
		key="dashboards"
		onClick={(...args: any[]) => {
			console.log('Dashboards click', ...args);
		}}
	>
		Gösterge Panoları
	</NavigationButton>,
	<NavigationButton
		key="teams"
		onClick={(...args: any[]) => {
			console.log('Teams click', ...args);
		}}
	>
		Takımlar
	</NavigationButton>,
	<NavigationButton
		key="plans"
		onClick={(...args: any[]) => {
			console.log('Plans click', ...args);
		}}
	>
		Planlar
	</NavigationButton>,
	<NavigationButton
		key="assets"
		onClick={(...args: any[]) => {
			console.log('Assets click', ...args);
		}}
	>
		Varlıklar
	</NavigationButton>,
	<NavigationButton
		key="apps"
		onClick={(...args: any[]) => {
			console.log('Apps click', ...args);
		}}
	>
		Uygulamalar
	</NavigationButton>,
];

export const jiraPrimaryItemsJapanese: React.JSX.Element[] = [
	<NavigationButton
		key="your-work"
		onClick={(...args: any[]) => {
			console.log('Your work click', ...args);
		}}
	>
		あなたの作業
	</NavigationButton>,
	<PrimaryDropdown key="projects" content={ProjectsContent} text="プロジェクト" />,
	<NavigationButton
		key="filters"
		onClick={(...args: any[]) => {
			console.log('Work items click', ...args);
		}}
		isHighlighted
	>
		フィルター
	</NavigationButton>,
	<NavigationButton
		key="dashboards"
		onClick={(...args: any[]) => {
			console.log('Dashboards click', ...args);
		}}
	>
		ダッシュボード
	</NavigationButton>,
	<NavigationButton
		key="teams"
		onClick={(...args: any[]) => {
			console.log('Teams click', ...args);
		}}
	>
		チーム
	</NavigationButton>,
	<NavigationButton
		key="plans"
		onClick={(...args: any[]) => {
			console.log('Plans click', ...args);
		}}
	>
		プラン
	</NavigationButton>,
	<NavigationButton
		key="assets"
		onClick={(...args: any[]) => {
			console.log('Assets click', ...args);
		}}
	>
		アセット
	</NavigationButton>,
	<NavigationButton
		key="apps"
		onClick={(...args: any[]) => {
			console.log('Apps click', ...args);
		}}
	>
		アプリ
	</NavigationButton>,
];

export const defaultPrimaryItems: React.JSX.Element[] = jiraPrimaryItems;
