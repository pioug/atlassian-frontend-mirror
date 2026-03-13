import React from 'react';

import { Label } from '@atlaskit/form';
import { AtlassianIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import Select, { type FormatOptionLabelMeta, type OptionType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const icon = <AtlassianIcon size="xxsmall" />;

const options: OptionType[] = [
	{ label: 'Adelaide', value: 'adelaide', elemBefore: icon },
	{ label: 'Brisbane', value: 'brisbane', elemBefore: icon },
	{ label: 'Canberra', value: 'canberra', elemBefore: icon },
	{ label: 'Darwin', value: 'darwin', elemBefore: icon },
	{ label: 'Hobart', value: 'hobart', elemBefore: icon },
	{ label: 'Melbourne', value: 'melbourne', elemBefore: icon },
	{ label: 'Perth', value: 'perth', elemBefore: icon },
	{ label: 'Sydney', value: 'sydney', elemBefore: icon },
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

const SelectMultiCustomValueTagLikeExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="multi-select-custom-value-tag-like">
			Multi select with custom value (icon + label)
		</Label>
		<Select
			inputId="multi-select-custom-value-tag-like"
			formatOptionLabel={formatOptionLabel}
			options={options}
			isMulti
			placeholder="Select cities..."
		/>
	</>
);

export default SelectMultiCustomValueTagLikeExample;
