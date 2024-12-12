import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';
import { token } from '@atlaskit/tokens';

const readViewContainerStyles = cssMap({
	root: {
		font: token('font.body'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.075'),
	},
});

const editViewContainerStyles = cssMap({
	root: {
		position: 'relative',
	},
});

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
					<Box xcss={editViewContainerStyles.root}>
						<Select {...fieldProps} options={selectOptions} isMulti autoFocus openMenuOnFocus />
					</Box>
				)}
				readView={() =>
					editValue && editValue.length === 0 ? (
						<Box xcss={readViewContainerStyles.root} testId="read-view">
							{selectLabel}
						</Box>
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
