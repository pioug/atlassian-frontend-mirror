/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form';
import PersonIcon from '@atlaskit/icon/core/person';
import Select, { components } from '@atlaskit/react-select';
import Tag from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

import { cities } from './common/data';

const optionStyles = cssMap({
	root: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	focused: {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
});

const tagColors = [
	'blue',
	'green',
	'purple',
	'teal',
	'red',
	'yellow',
	'orange',
	'magenta',
] as const;

// Example showing custom dropdown styling with Tag component look
// The tags in the value area remain simple (just text)
// The dropdown menu is customized to look like colorful, non-removable tags with elemBefore icons
// formatOptionLabel is NOT used, allowing elemBefore to work in dropdown
const CustomDropdownWithTagsExample = (): React.JSX.Element => {
	const optionsWithIcon = cities.map((option, index) => ({
		...option,
		elemBefore: <PersonIcon label={option.label} size="small" />,
		color: tagColors[index % tagColors.length],
	}));

	// Custom components to make dropdown look like tags
	const customComponents = {
		Option: (props: any) => {
			const { data, isFocused } = props;
			return (
				<components.Option {...props}>
					<div css={[optionStyles.root, isFocused && optionStyles.focused]}>
						<Tag
							text={data.label}
							color={data.color}
							elemBefore={data.elemBefore}
							isRemovable={false}
						/>
					</div>
				</components.Option>
			);
		},
	};

	return (
		<>
			<Label htmlFor="custom-dropdown-multi-select">Select cities (dropdown styled as tags):</Label>
			<Select
				inputId="custom-dropdown-multi-select"
				testId="react-select-custom-dropdown"
				options={optionsWithIcon}
				isMulti
				placeholder="Choose cities..."
				components={customComponents}
			/>
			<p>
				The dropdown menu shows colorful, non-removable tags with icons. The selected tags in the
				value area remain simple and removable. This shows how you can customize just the dropdown
				independently of the tag display.
			</p>
		</>
	);
};

export default CustomDropdownWithTagsExample;
