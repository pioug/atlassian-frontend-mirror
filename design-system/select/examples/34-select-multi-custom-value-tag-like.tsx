import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import Select from '@atlaskit/select/default';
import type { OptionType } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

const customValueOptions: OptionType[] = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

const colorOptions: OptionType[] = [
	{ label: 'Red', value: 'red', color: 'red' },
	{ label: 'Yellow', value: 'yellow', color: 'yellow' },
	{ label: 'Green', value: 'green', color: 'green' },
	{ label: 'Blue', value: 'blue', color: 'blue' },
	{ label: 'Default', value: 'default', color: 'gray' },
	{ label: 'Purple', value: 'purple', color: 'purple' },
	{ label: 'Teal', value: 'teal', color: 'teal' },
];

/**
 * Custom JSX is returned for selected values so the visual uplift uses the tag-like path.
 */
const customJsx = (option: OptionType) => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- example layout
			display: 'flex',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- example layout
			alignItems: 'center',
		}}
	>
		<AtlassianIcon size="xsmall" />
		<span
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- example layout
				paddingLeft: token('space.025'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- example typography
				font: token('font.body.small'),
			}}
		>
			{option.label}
		</span>
	</div>
);

const formatOptionLabel = (option: OptionType) => customJsx(option);
const plainFormatOptionLabel = (option: OptionType) => option.label;

const SelectMultiCustomValueTagLikeExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="multi-select-custom-value">Multi select with custom value (icon + label)</Label>
		<Select
			inputId="multi-select-custom-value"
			formatOptionLabel={formatOptionLabel}
			options={customValueOptions}
			isMulti
			placeholder="Select cities..."
		/>

		<Label htmlFor="multi-select-colors">Multi select with colored tags</Label>
		<Select
			inputId="multi-select-colors"
			formatOptionLabel={plainFormatOptionLabel}
			options={colorOptions}
			isMulti
			placeholder="Select statuses..."
		/>
	</>
);

export default SelectMultiCustomValueTagLikeExample;
