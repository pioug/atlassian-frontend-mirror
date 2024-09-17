import React, { type FC, useState } from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';

import InlineEdit from '../src';

const readViewContainerStyles = xcss({
	display: 'flex',
	maxWidth: '100%',
	wordBreak: 'break-word',
});

const ReadViewContainer: FC<{ children: string }> = ({ children }) => (
	<Box
		paddingBlockStart="space.150"
		paddingBlockEnd="space.150"
		padding="space.100"
		xcss={readViewContainerStyles}
		testId="read-view"
	>
		{children}
	</Box>
);

const EditViewContainerStyles = xcss({
	// zIndex: 300,
	position: 'relative',
});

const EditViewContainer: FC<{ children: React.ReactNode }> = ({ children }) => (
	<Box xcss={EditViewContainerStyles}>{children}</Box>
);

const selectOptions = [
	{ label: 'Apple', value: 'Apple' },
	{ label: 'Banana', value: 'Banana' },
	{ label: 'Cherry', value: 'Cherry' },
	{ label: 'Mango', value: 'Mango' },
	{ label: 'Orange', value: 'Orange' },
	{ label: 'Strawberry', value: 'Strawberry' },
	{ label: 'Watermelon', value: 'Watermelon' },
];

const InlineEditExample = () => {
	const [editValue, setEditValue] = useState<ValueType<OptionType, true>>([]);
	const selectLabel = 'Select fruit';
	const inlineEditLabel = 'Inline Edit select';

	const onConfirm = (value: ValueType<OptionType, true>) => {
		if (!value) {
			return;
		}

		setEditValue(value);
	};

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEdit<ValueType<OptionType, true>>
				defaultValue={editValue}
				label={inlineEditLabel}
				editButtonLabel={editValue.length > 0 ? inlineEditLabel : selectLabel}
				editView={(fieldProps) => (
					<EditViewContainer>
						<Select {...fieldProps} options={selectOptions} isMulti autoFocus openMenuOnFocus />
					</EditViewContainer>
				)}
				readView={() =>
					editValue && editValue.length === 0 ? (
						<ReadViewContainer>{selectLabel}</ReadViewContainer>
					) : (
						<Box padding="space.050">
							<Group label="Selected fruits">
								{editValue &&
									editValue.map((option: OptionType) => (
										<Tag text={option.label} key={option.label} />
									))}
							</Group>
						</Box>
					)
				}
				onConfirm={onConfirm}
			/>
		</Box>
	);
};

export default InlineEditExample;
