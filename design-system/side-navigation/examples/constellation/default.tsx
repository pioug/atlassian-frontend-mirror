import React from 'react';

import FilterIcon from '@atlaskit/icon/core/migration/filter';
import FolderClosedIcon from '@atlaskit/icon/core/migration/folder-closed--folder';
import GlobeIcon from '@atlaskit/icon/core/migration/globe--world';
import LightbulbIcon from '@atlaskit/icon/core/migration/lightbulb';
import PagesIcon from '@atlaskit/icon/core/migration/pages--queues';
import PersonIcon from '@atlaskit/icon/core/migration/person';
import SettingsIcon from '@atlaskit/icon/core/migration/settings';

import {
	ButtonItem,
	LinkItem,
	NavigationFooter,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
} from '../../src';
import AppFrame from '../common/app-frame';
import SampleFooter from '../common/sample-footer';
import SampleHeader from '../common/sample-header';

const BasicExample = () => {
	return (
		<AppFrame shouldHideAppBar>
			<SideNavigation label="project" testId="side-navigation">
				<NavigationHeader>
					<SampleHeader />
				</NavigationHeader>
				<NestableNavigationContent initialStack={[]} testId="nestable-navigation-content">
					<Section isList>
						<NestingItem
							id="filters"
							testId="filter-nesting-item"
							title="Filters"
							iconBefore={<FilterIcon label="" />}
							iconAfter={<LightbulbIcon label="" />}
						>
							<Section>
								<ButtonItem>Search work items</ButtonItem>
							</Section>
							<Section title="Starred" isList>
								<ButtonItem>Everything for me</ButtonItem>
								<ButtonItem>My open work items</ButtonItem>
								<ButtonItem>Reported by me</ButtonItem>
							</Section>
							<Section hasSeparator title="Other" isList>
								<ButtonItem>All work items</ButtonItem>
								<ButtonItem>Open work items</ButtonItem>
								<ButtonItem>Created recently</ButtonItem>
								<ButtonItem>Resolved recently</ButtonItem>
							</Section>
							<Section hasSeparator>
								<ButtonItem>View all filters</ButtonItem>
							</Section>
						</NestingItem>
						<NestingItem
							id="queues"
							isSelected
							title="Queues view"
							iconBefore={<PagesIcon label="" />}
						>
							<Section title="Queues" isList>
								<ButtonItem>Untriaged</ButtonItem>
								<ButtonItem>My feature work</ButtonItem>
								<ButtonItem>My bugfix work</ButtonItem>
								<ButtonItem>Signals</ButtonItem>
								<ButtonItem>Assigned to me</ButtonItem>
							</Section>
							<Section hasSeparator>
								<ButtonItem>New queue</ButtonItem>
							</Section>
						</NestingItem>
						<NestingItem
							id="settings"
							iconBefore={<SettingsIcon label="" />}
							title="Settings"
							testId="settings-nesting-item"
						>
							<Section>
								<NestingItem
									iconBefore={<GlobeIcon label="" />}
									id="language-menu"
									title="Language settings"
								>
									<Section>
										<ButtonItem>Customize</ButtonItem>
										<NestingItem id="german-settings" title="German Settings">
											<Section>
												<ButtonItem>Hallo Welt!</ButtonItem>
											</Section>
										</NestingItem>
										<NestingItem id="english-settings" title="English Settings">
											<Section>
												<ButtonItem>Hello World!</ButtonItem>
											</Section>
										</NestingItem>
									</Section>
								</NestingItem>
							</Section>
						</NestingItem>
						<ButtonItem iconBefore={<FolderClosedIcon label="" />}>Your work</ButtonItem>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						<LinkItem href="#" iconBefore={<PersonIcon label="" />}>
							Your customers
						</LinkItem>
					</Section>
				</NestableNavigationContent>
				<NavigationFooter>
					<SampleFooter />
				</NavigationFooter>
			</SideNavigation>
		</AppFrame>
	);
};

export default BasicExample;
