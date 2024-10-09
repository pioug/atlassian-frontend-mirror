/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';

import InlineEdit from '../../src';

const containerStyles = xcss({
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingBlockEnd: 'space.600',
});

const readViewContainerStyles = xcss({
	font: 'font.body',
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
});

const editViewContainerStyles = xcss({
	position: 'relative',
	zIndex: 'dialog',
});

const tagGroupContainerStyles = xcss({ padding: 'space.050' });
const selectOptions = [
	{ label: 'CSS', value: 'CSS' },
	{ label: 'Design', value: 'Design' },
	{ label: 'HTML', value: 'HTML' },
	{ label: 'Javascript', value: 'Javascript' },
	{ label: 'User experience', value: 'User experience' },
	{ label: 'User research', value: 'User research' },
];

const InlineEditCustomSelectExample = () => {
	const [editValue, setEditValue] = useState<ValueType<OptionType, true>>([]);
	const inlineEditLabel = 'Skills required';
	const selectLabel = 'Select skills';

	const onConfirm = (value: ValueType<OptionType, true>) => {
		if (!value) {
			return;
		}

		setEditValue(value);
	};

	return (
		<Box xcss={containerStyles}>
			<InlineEdit<ValueType<OptionType, true>>
				defaultValue={editValue}
				label={inlineEditLabel}
				editButtonLabel={editValue.length > 0 ? inlineEditLabel : selectLabel}
				editView={(fieldProps) => (
					<Box xcss={editViewContainerStyles}>
						<Select {...fieldProps} options={selectOptions} isMulti autoFocus openMenuOnFocus />
					</Box>
				)}
				readView={() =>
					editValue && editValue.length === 0 ? (
						<Box xcss={readViewContainerStyles}>{selectLabel}</Box>
					) : (
						<Box xcss={tagGroupContainerStyles}>
							<Group label="Selected skills">
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

export default InlineEditCustomSelectExample;
