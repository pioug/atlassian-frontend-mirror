/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Select, { type ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';
import {
	fontSize as getFontSize,
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const containerStyles = xcss({
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingBlockEnd: 'space.600',
});

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = xcss({
	display: 'flex',
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${(gridSize * 2.5) / fontSize}em`,
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	fontSize: `${fontSize}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: `${(gridSize * 2.5) / fontSize}`,
});

const editViewContainerStyles = xcss({
	position: 'relative',
	zIndex: 'dialog',
});

const tagGroupContainerStyles = xcss({ padding: 'space.050' });
interface OptionType {
	label: string;
	value: string;
}

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
				label="Skills required"
				editView={(fieldProps) => (
					<Box xcss={editViewContainerStyles}>
						<Select {...fieldProps} options={selectOptions} isMulti autoFocus openMenuOnFocus />
					</Box>
				)}
				readView={() =>
					editValue && editValue.length === 0 ? (
						<Box xcss={readViewContainerStyles}>Select options</Box>
					) : (
						<Box xcss={tagGroupContainerStyles}>
							<Group>
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
