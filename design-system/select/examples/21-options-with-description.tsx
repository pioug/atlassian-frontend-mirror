import React from 'react';

import { Label } from '@atlaskit/form';
import Select, { type FormatOptionLabelMeta, type OptionType } from '@atlaskit/select';

type CustomOption = {
	label: string;
	value: string;
	description?: string;
};

const options: CustomOption[] = [
	{
		label: 'Adelaide',
		value: 'adelaide',
		description: 'A nice place to live',
	},
	{
		label: 'Brisbane',
		value: 'brisbane',
		description: 'A boisterous and energetic city',
	},
	{ label: 'Canberra', value: 'canberra', description: 'The capital' },
	{ label: 'Darwin', value: 'darwin' },
	{
		label: 'Hobart',
		value: 'hobart',
		description: 'Scenic, and serene',
	},
	{
		label: 'Melbourne',
		value: 'melbourne',
		description: 'Charming, and cultured',
	},
	{ label: 'Perth', value: 'perth', description: 'Lovely city' },
	{
		label: 'Sydney',
		value: 'sydney',
		description: 'Nothing good happens ever happens here',
	},
];

const formatOptionLabel = (option: OptionType, { context }: FormatOptionLabelMeta<OptionType>) => {
	if (context === 'menu') {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div>{option.label}</div>
				{option.description ? (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<div style={{ fontSize: 12, fontStyle: 'italic' }}>{option.description}</div>
				) : null}
			</div>
		);
	}
	return option.label;
};
const Example = (): React.JSX.Element => (
	<>
		<Label htmlFor="option-w-desc-example">Which city do you live in?</Label>
		<Select
			inputId="option-w-desc-example"
			formatOptionLabel={formatOptionLabel}
			options={options}
		/>
	</>
);

export default Example;
