import React from 'react';

import { Box, Stack, xcss } from '@atlaskit/primitives';

import Select, { type OptionType, type FormatOptionLabelMeta } from '../../src';

const optionDescriptionStyles = xcss({
	fontSize: 12,
	fontStyle: 'italic',
});

const formatOptionLabel = (option: OptionType, { context }: FormatOptionLabelMeta<OptionType>) => {
	if (context === 'menu') {
		return (
			<Stack>
				<Box>{option.label}</Box>
				{option.description ? <Box xcss={optionDescriptionStyles}>{option.description}</Box> : null}
			</Stack>
		);
	}
	return option.label;
};
const OptionWithDescription = () => (
	<Select
		formatOptionLabel={formatOptionLabel}
		options={[
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
			{ label: 'Hobart', value: 'hobart', description: 'Scenic, and serene' },
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
		]}
	/>
);

export default OptionWithDescription;
