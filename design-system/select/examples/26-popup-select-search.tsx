import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '@atlaskit/radio';
import { type OptionsPropType } from '@atlaskit/radio/types';
import { PopupSelect } from '@atlaskit/select';

const cities = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

const SelectPopupSearchExample = (): React.JSX.Element => {
	const [isSearchable, setIsSearchable] = useState(false);
	const [searchThreshold, setSearchThreshold] = useState('1');

	const radio_options: OptionsPropType = [
		{ name: '1', value: '1', label: '1' },
		{ name: '5', value: '5', label: '5' },
		{ name: '10', value: '10', label: '10' },
	];

	return (
		<>
			<p>searchThreshold</p>
			<RadioGroup
				defaultValue={'1'}
				options={radio_options}
				onChange={(e) => setSearchThreshold(e.target.value)}
				labelId="radiogroup-label"
			/>
			<Checkbox
				value="isSearchable"
				name="toggleValue"
				isChecked={isSearchable}
				onChange={(e) => setIsSearchable(e.currentTarget.checked)}
				label={<code>isSearchable</code>}
			/>
			<PopupSelect
				options={cities}
				searchThreshold={parseInt(searchThreshold)}
				placeholder={''}
				isSearchable={isSearchable}
				target={({ isOpen, ...triggerProps }) => (
					<Button isSelected={isOpen} {...triggerProps}>
						Target
					</Button>
				)}
			/>
		</>
	);
};

export default SelectPopupSearchExample;
