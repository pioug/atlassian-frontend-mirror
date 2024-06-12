import React, { Fragment, type SyntheticEvent, useCallback, useState } from 'react';

import { Checkbox } from '@atlaskit/checkbox';

import { RadioGroup } from '../../src';
import { type OptionsPropType } from '../../src/types';

const options: OptionsPropType = [
	{ name: 'color', value: 'red', label: 'Red' },
	{ name: 'color', value: 'blue', label: 'Blue' },
	{ name: 'color', value: 'yellow', label: 'Yellow' },
	{ name: 'color', value: 'green', label: 'Green' },
	{ name: 'color', value: 'black', label: 'Black' },
];

export default function BasicExample() {
	const [isDisabled, setIsDisabled] = useState<boolean>();
	const [onChangeResult, setOnChangeResult] = useState<string>(
		'Click on a radio field to trigger onChange',
	);

	const onChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
		setOnChangeResult(`onChange called with value: ${event.currentTarget.value}`);
	}, []);

	const toggleCheckbox = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
		setIsDisabled(event.currentTarget.checked);
	}, []);

	return (
		<Fragment>
			<h4 id="radiogroup-label">Choose a color:</h4>
			<RadioGroup
				isDisabled={isDisabled}
				options={options}
				onChange={onChange}
				aria-labelledby="radiogroup-label"
			/>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderStyle: 'dashed',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderWidth: '1px',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderColor: '#ccc',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: '0.5em',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					color: '#ccc',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: '0.5em',
				}}
			>
				{onChangeResult}
			</div>
			<Checkbox
				value="isDisabled"
				label="Make this radio group disabled"
				onChange={toggleCheckbox}
			/>
		</Fragment>
	);
}
