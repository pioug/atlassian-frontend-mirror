import React, { type KeyboardEvent, useState } from 'react';

import { useOverflowStatus } from '@atlaskit/atlassian-navigation';
import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { Label } from '@atlaskit/form';
import EditorAddIcon from '@atlaskit/icon/glyph/add';
import EditorPeopleIcon from '@atlaskit/icon/glyph/people-group';
import { ButtonItem, HeadingItem, MenuGroup } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { type PopupProps } from '@atlaskit/popup/types';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

interface SearchDropdownItemProps {
	setFilteredOptions: React.Dispatch<React.SetStateAction<{ label: string; value: string }[]>>;
	filteredOptions: { label: string; value: string }[];
}

const searchOptions = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
	{ label: 'Option 3', value: 'option3' },
];

const SearchDropdownItem = ({ setFilteredOptions, filteredOptions }: SearchDropdownItemProps) => {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchText = e.target.value.toLowerCase();
		const filteredItems = searchOptions.filter((option) =>
			option.label.toLowerCase().includes(searchText),
		);
		setFilteredOptions(filteredItems);
	};

	return (
		<Box paddingInline="space.200">
			<Label htmlFor="basic-textfield">Filter menu items</Label>
			<Textfield onChange={handleSearchChange} name="basic" id="basic-textfield" />
		</Box>
	);
};

type PrimaryDropdownProps = {
	content: PopupProps['content'];
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	isHighlighted?: boolean;
};

const PrimaryDropdown = (props: PrimaryDropdownProps) => {
	const { content, text } = props;
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
				<Button
					onClick={onClick}
					onKeyDown={onKeyDown}
					isSelected={isOpen}
					testId={`${text}-popup-trigger`}
					{...triggerProps}
				>
					{text}
				</Button>
			)}
		/>
	);
};

const SearchableDropdown = () => {
	const [filteredOptions, setFilteredOptions] = React.useState(searchOptions);
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

const OptionsContent = () => (
	<MenuGroup>
		<Box role="menu" paddingBlock="space.200">
			<HeadingItem>Teammates</HeadingItem>
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

const styles = cssMap({
	container: {
		display: 'flex',
		alignItems: 'flex-start',
		paddingTop: token('space.200', '16px'),
		paddingRight: token('space.200', '16px'),
		paddingBottom: token('space.200', '16px'),
		paddingLeft: token('space.200', '16px'),
	},
});

const CustomDropdownMenu = () => (
	<Box xcss={styles.container}>
		<PrimaryDropdown content={OptionsContent} text="Mixed item" />
	</Box>
);

export default CustomDropdownMenu;
