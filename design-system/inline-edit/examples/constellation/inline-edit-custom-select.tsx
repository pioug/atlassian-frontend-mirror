/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.600'),
	},
});

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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		zIndex: 'dialog' as any,
	},
});

const tagGroupContainerStyles = cssMap({
	root: {
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
	},
});
const selectOptions = [
	{ label: 'CSS', value: 'CSS' },
	{ label: 'Design', value: 'Design' },
	{ label: 'HTML', value: 'HTML' },
	{ label: 'Javascript', value: 'Javascript' },
	{ label: 'User experience', value: 'User experience' },
	{ label: 'User research', value: 'User research' },
];

const InlineEditCustomSelectExample: () => JSX.Element = () => {
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
		<Box xcss={containerStyles.root}>
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
						<Box xcss={readViewContainerStyles.root}>{selectLabel}</Box>
					) : (
						<Box xcss={tagGroupContainerStyles.root}>
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
