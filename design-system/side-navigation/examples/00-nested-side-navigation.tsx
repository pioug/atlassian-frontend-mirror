import React, { Fragment } from 'react';

import { cssMap } from '@atlaskit/css';
import AppIcon from '@atlaskit/icon/core/app';
import FilterIcon from '@atlaskit/icon/core/filter';
import WorkIcon from '@atlaskit/icon/core/folder-closed';
import LanguageIcon from '@atlaskit/icon/core/globe';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import QueueIcon from '@atlaskit/icon/core/pages';
import CustomerIcon from '@atlaskit/icon/core/person';
import SettingsIcon from '@atlaskit/icon/core/settings';
import { Flex } from '@atlaskit/primitives/compiled';
import {
	ButtonItem,
	LinkItem,
	NavigationFooter,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
} from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

import AppFrame from './common/app-frame';
import SampleFooter from './common/sample-footer';
import SampleHeader from './common/sample-header';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const LanguageSettings = () => {
	return (
		<NestingItem
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<LanguageIcon label="" />
				</Flex>
			}
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
	);
};

const BasicExample = (): React.JSX.Element => {
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
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<FilterIcon label="" />
								</Flex>
							}
							iconAfter={
								<Flex xcss={iconSpacingStyles.space050}>
									<LightbulbIcon label="" />
								</Flex>
							}
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
							testId="selected"
							isSelected
							title="Queues view"
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<QueueIcon label="" />
								</Flex>
							}
							aria-current={true}
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
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<SettingsIcon label="" />
								</Flex>
							}
							title="Settings"
							testId="settings-nesting-item"
						>
							<Section>
								<LanguageSettings />
							</Section>
						</NestingItem>
						<NestingItem
							id="dropbox"
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<AppIcon label="" />
								</Flex>
							}
							title="Dropbox"
							testId="dropbox-nesting-item"
							isDisabled
						>
							<Fragment />
						</NestingItem>
						<ButtonItem
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<WorkIcon label="" />
								</Flex>
							}
						>
							Your work
						</ButtonItem>
						{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid */}
						<LinkItem
							href="#"
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<CustomerIcon label="" />
								</Flex>
							}
						>
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
