import React from 'react';

import { Label } from '@atlaskit/form';
import { AtlassianIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import Select, { type FormatOptionLabelMeta, type OptionType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const icon = <AtlassianIcon size="xxsmall" />;

const elemBeforeOptions: OptionType[] = [
	{ label: 'Adelaide', value: 'adelaide', elemBefore: icon },
	{ label: 'Brisbane', value: 'brisbane', elemBefore: icon },
	{ label: 'Canberra', value: 'canberra', elemBefore: icon },
	{ label: 'Darwin', value: 'darwin', elemBefore: icon },
	{ label: 'Hobart', value: 'hobart', elemBefore: icon },
	{ label: 'Melbourne', value: 'melbourne', elemBefore: icon },
	{ label: 'Perth', value: 'perth', elemBefore: icon },
	{ label: 'Sydney', value: 'sydney', elemBefore: icon },
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
 * When the feature flag `platform-dst-lozenge-tag-badge-visual-uplifts` is ON,
 * selected values render as Tag with `elemBefore` read from option data.
 * The menu still shows custom JSX (icon + label).
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
		<AtlassianIcon size="small" />
		<span
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- example layout
				paddingLeft: token('space.100', '8px'),
			}}
		>
			{option.label}
		</span>
	</div>
);

const formatOptionLabel = (option: OptionType, meta: FormatOptionLabelMeta<OptionType>) => {
	if (meta.context === 'value' && fg('platform-dst-lozenge-tag-badge-visual-uplifts')) {
		return option.label;
	}
	return customJsx(option);
};

const plainFormatOptionLabel = (option: OptionType, meta: FormatOptionLabelMeta<OptionType>) => {
	if (meta.context === 'value' && fg('platform-dst-lozenge-tag-badge-visual-uplifts')) {
		return option.label;
	}
	return option.label;
};

const SelectMultiCustomValueTagLikeExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="multi-select-elem-before">Multi select with elemBefore (icon + label)</Label>
		<Select
			inputId="multi-select-elem-before"
			formatOptionLabel={formatOptionLabel}
			options={elemBeforeOptions}
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
