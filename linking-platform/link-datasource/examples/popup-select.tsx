import React, { useCallback, useState } from 'react';

import { cssMap } from '@compiled/react';
import { IntlProvider } from 'react-intl-next';

import { Box, Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import { type InputActionMeta, type ValueType } from '@atlaskit/select';

import { FilterPopupSelect } from '../src/ui/common/modal/popup-select';
import { type CustomMenuListProps } from '../src/ui/common/modal/popup-select/menu-list';
import {
	type AvatarLabelOption,
	type IconLabelOption,
	type LozengeLabelOption,
	type SelectOption,
} from '../src/ui/common/modal/popup-select/types';

const styles = cssMap({
	container: {
		maxWidth: '800px',
		marginInline: 'auto',
	},
});

// Mock icon label options (for project filter)
const mockIconOptions: IconLabelOption[] = [
	{ label: 'Jira Software', value: 'jira-software', icon: '🔷', optionType: 'iconLabel' },
	{ label: 'Jira Service Management', value: 'jira-sm', icon: '🟣', optionType: 'iconLabel' },
	{ label: 'Confluence', value: 'confluence', icon: '🔵', optionType: 'iconLabel' },
	{ label: 'Bitbucket', value: 'bitbucket', icon: '🔹', optionType: 'iconLabel' },
	{ label: 'Trello', value: 'trello', icon: '📋', optionType: 'iconLabel' },
];

// Mock lozenge label options (for status filter)
const mockLozengeOptions: LozengeLabelOption[] = [
	{ label: 'To Do', value: 'todo', appearance: 'default', optionType: 'lozengeLabel' },
	{
		label: 'In Progress',
		value: 'in-progress',
		appearance: 'inprogress',
		optionType: 'lozengeLabel',
	},
	{ label: 'In Review', value: 'in-review', appearance: 'moved', optionType: 'lozengeLabel' },
	{ label: 'Done', value: 'done', appearance: 'success', optionType: 'lozengeLabel' },
	{ label: 'Blocked', value: 'blocked', appearance: 'removed', optionType: 'lozengeLabel' },
	{ label: 'New', value: 'new', appearance: 'new', optionType: 'lozengeLabel' },
];

// Mock avatar label options (for assignee filter)
const mockAvatarOptions: AvatarLabelOption[] = [
	{ label: 'Jane Doe', value: 'jane-doe', optionType: 'avatarLabel' },
	{ label: 'John Smith', value: 'john-smith', optionType: 'avatarLabel' },
	{ label: 'Alice Johnson', value: 'alice-johnson', optionType: 'avatarLabel' },
	{ label: 'Bob Williams', value: 'bob-williams', optionType: 'avatarLabel' },
	{
		label: 'Engineering Team',
		value: 'engineering-team',
		isGroup: true,
		optionType: 'avatarLabel',
	},
	{ label: 'Design Team', value: 'design-team', isGroup: true, optionType: 'avatarLabel' },
];

interface PopupSelectExampleProps {
	buttonLabel: string;
	filterName: string;
	initialStatus?: 'empty' | 'loading' | 'resolved' | 'rejected' | 'loadingMore';
	isDisabled?: boolean;
	options: SelectOption[];
	searchPlaceholder?: string;
	showFooter?: boolean;
	totalCount?: number;
}

const PopupSelectExample = ({
	filterName,
	buttonLabel,
	options,
	searchPlaceholder,
	showFooter = true,
	totalCount,
	initialStatus = 'resolved',
	isDisabled = false,
}: PopupSelectExampleProps) => {
	const [selectedOptions, setSelectedOptions] = useState<ValueType<SelectOption, true>>([]);
	const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
	const [status, setStatus] = useState<
		'empty' | 'loading' | 'resolved' | 'rejected' | 'loadingMore'
	>(initialStatus);

	const handleSelectionChange = useCallback((newValue: ValueType<SelectOption, true>) => {
		setSelectedOptions(newValue);
	}, []);

	const handleInputChange = useCallback(
		(newValue: string, _actionMeta: InputActionMeta) => {
			if (newValue === '') {
				setFilteredOptions(options);
			} else {
				const filtered = options.filter((option) =>
					option.label.toLowerCase().includes(newValue.toLowerCase()),
				);
				setFilteredOptions(filtered);
			}
		},
		[options],
	);

	const handleShowMore = useCallback(() => {
		setStatus('loadingMore');
		// Simulate loading more options
		setTimeout(() => {
			setStatus('resolved');
		}, 1000);
	}, []);

	const menuListProps: CustomMenuListProps = {
		filterName,
		isLoading: status === 'loading',
		isLoadingMore: status === 'loadingMore',
		isError: status === 'rejected',
		isEmpty: status === 'resolved' && filteredOptions.length === 0,
		showMore: filteredOptions.length < (totalCount ?? options.length),
		handleShowMore,
		filterLabel: buttonLabel,
	};

	return (
		<FilterPopupSelect
			filterName={filterName}
			buttonLabel={buttonLabel}
			options={filteredOptions}
			selectedOptions={selectedOptions}
			onSelectionChange={handleSelectionChange}
			onInputChange={handleInputChange}
			menuListProps={menuListProps}
			status={status}
			isDisabled={isDisabled}
			showLoading={status === 'loading'}
			showHydrating={status === 'loading'}
			shouldShowFooter={showFooter}
			totalCount={totalCount ?? options.length}
			searchPlaceholder={searchPlaceholder}
		/>
	);
};

const PopupSelectExamples = () => {
	return (
		<Box padding="space.300" xcss={styles.container}>
			<Stack space="space.300">
				<Stack space="space.100">
					<Text as="strong" size="large" weight="bold">
						FilterPopupSelect Examples
					</Text>
					<Text color="color.text.subtlest">
						Interactive examples of the FilterPopupSelect component with different option types.
					</Text>
				</Stack>

				<Stack space="space.100">
					<Text weight="semibold">Icon Label Options (Project Filter)</Text>
					<Flex gap="space.100" wrap="wrap" alignItems="start">
						<PopupSelectExample
							filterName="project"
							buttonLabel="Project"
							options={mockIconOptions}
							searchPlaceholder="Search projects..."
							totalCount={mockIconOptions.length}
						/>
					</Flex>
				</Stack>

				<Stack space="space.100">
					<Text weight="semibold">Lozenge Label Options (Status Filter)</Text>
					<Flex gap="space.100" wrap="wrap" alignItems="start">
						<PopupSelectExample
							filterName="status"
							buttonLabel="Status"
							options={mockLozengeOptions}
							searchPlaceholder="Search statuses..."
							totalCount={mockLozengeOptions.length}
						/>
					</Flex>
				</Stack>

				<Stack space="space.100">
					<Text weight="semibold">Avatar Label Options (Assignee Filter)</Text>
					<Flex gap="space.100" wrap="wrap" alignItems="start">
						<PopupSelectExample
							filterName="assignee"
							buttonLabel="Assignee"
							options={mockAvatarOptions}
							searchPlaceholder="Search people..."
							totalCount={mockAvatarOptions.length}
						/>
					</Flex>
				</Stack>

				<Stack space="space.100">
					<Text weight="semibold">States</Text>
					<Flex gap="space.100" wrap="wrap" alignItems="start">
						<PopupSelectExample
							filterName="disabled-filter"
							buttonLabel="Disabled"
							options={mockIconOptions}
							isDisabled={true}
						/>
						<PopupSelectExample
							filterName="loading-filter"
							buttonLabel="Loading"
							options={[]}
							initialStatus="loading"
						/>
						<PopupSelectExample
							filterName="empty-filter"
							buttonLabel="No Results"
							options={[]}
							initialStatus="resolved"
						/>
					</Flex>
				</Stack>

				<Stack space="space.100">
					<Text weight="semibold">With Pagination (Show More)</Text>
					<Flex gap="space.100" wrap="wrap" alignItems="start">
						<PopupSelectExample
							filterName="paginated-filter"
							buttonLabel="Paginated"
							options={mockLozengeOptions.slice(0, 3)}
							totalCount={mockLozengeOptions.length}
							showFooter={true}
						/>
					</Flex>
				</Stack>
			</Stack>
		</Box>
	);
};

export default (): React.JSX.Element => (
	<IntlProvider locale="en">
		<PopupSelectExamples />
	</IntlProvider>
);
