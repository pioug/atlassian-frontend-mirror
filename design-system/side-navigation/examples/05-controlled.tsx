/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import FilterIcon from '@atlaskit/icon/core/filter';
import WorkIcon from '@atlaskit/icon/core/folder-closed';
import LanguageIcon from '@atlaskit/icon/core/globe';
import QueueIcon from '@atlaskit/icon/core/pages';
import CustomerIcon from '@atlaskit/icon/core/person';
import SettingsIcon from '@atlaskit/icon/core/settings';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import {
	ButtonItem,
	HeadingItem,
	LinkItem,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
} from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const styles = cssMap({
	container: {
		flexGrow: 1,
	},
});

interface Option {
	label: string;
	value: string[];
}

const LanguageSettings = () => {
	return (
		<NestingItem
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<LanguageIcon label="" />
				</Flex>
			}
			id="3-1"
			title="Language settings"
		>
			<ButtonItem>Customize</ButtonItem>
			<NestingItem id="3-1-1" title="German Settings">
				<ButtonItem>Hallo Welt!</ButtonItem>
			</NestingItem>
			<NestingItem id="3-1-2" title="English Settings">
				<ButtonItem>Hello World!</ButtonItem>
			</NestingItem>
		</NestingItem>
	);
};

const ControlledExample: () => JSX.Element = () => {
	const [stack, setStack] = useState<string[]>([]);

	return (
		<AppFrame
			content={
				<Box padding="space.400" xcss={styles.container}>
					<Label htmlFor="nav-select">Select a navigation item</Label>
					<Select<Option>
						inputId="nav-select"
						onChange={(value) => setStack((value as Option).value || [])}
						options={[
							{ label: 'Root', value: [] },
							{
								label: 'Queues view',
								value: ['1'],
							},
							{
								label: 'Filters',
								value: ['2'],
							},
							{
								label: 'Settings',
								value: ['3'],
							},
							{
								label: 'Settings -> Language settings',
								value: ['3', '3-1'],
							},
							{
								label: 'Settings -> Language settings -> German settings',
								value: ['3', '3-1', '3-1-1'],
							},
							{
								label: 'Settings -> Language settings -> English settings',
								value: ['3', '3-1', '3-1-2'],
							},
							{
								label: 'Unknown view',
								value: ['potato'],
							},
						]}
						value={{
							label: stack.length ? stack.join(',') : 'Root',
							value: stack,
						}}
					/>
				</Box>
			}
		>
			<SideNavigation label="project" testId="side-navigation">
				<NavigationHeader>
					<SampleHeader />
				</NavigationHeader>
				<NestableNavigationContent onChange={setStack} stack={stack}>
					<Section>
						<ButtonItem
							isSelected
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
						<NestingItem
							id="1"
							title="Queues view"
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<QueueIcon label="" />
								</Flex>
							}
						>
							<Section>
								<HeadingItem>Queues</HeadingItem>
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
							id="2"
							testId="filter-nesting-item"
							title="Filters"
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<FilterIcon label="" />
								</Flex>
							}
						>
							<Section>
								<ButtonItem>Search work items</ButtonItem>
							</Section>
							<Section>
								<HeadingItem>Starred</HeadingItem>
								<ButtonItem>Everything me</ButtonItem>
								<ButtonItem>My open work items</ButtonItem>
								<ButtonItem>Reported by me</ButtonItem>
							</Section>
							<Section hasSeparator>
								<HeadingItem>Other</HeadingItem>
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
							id="3"
							iconBefore={
								<Flex xcss={iconSpacingStyles.space050}>
									<SettingsIcon label="" />
								</Flex>
							}
							title="Settings"
						>
							<LanguageSettings />
						</NestingItem>
					</Section>
				</NestableNavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default ControlledExample;
