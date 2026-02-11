/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type SyntheticEvent, useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '@atlaskit/radio';
import { type OptionsPropType } from '@atlaskit/radio/types';
import { token } from '@atlaskit/tokens';

const options: OptionsPropType = [
	{ name: 'color', value: 'red', label: 'Red' },
	{ name: 'color', value: 'blue', label: 'Blue' },
	{ name: 'color', value: 'yellow', label: 'Yellow' },
	{ name: 'color', value: 'green', label: 'Green' },
	{ name: 'color', value: 'black', label: 'Black' },
];

const radioGroupStyles = css({
	margin: '0.5em',
	padding: '0.5em',
	borderColor: '#ccc',
	borderStyle: 'dashed',
	borderWidth: token('border.width'),
	color: '#ccc',
});

export default function BasicExample(): JSX.Element {
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
		<div>
			<h4 id="radiogroup-label">Choose a color:</h4>
			<RadioGroup
				isDisabled={isDisabled}
				options={options}
				onChange={onChange}
				labelId="radiogroup-label"
			/>
			<div css={radioGroupStyles}>{onChangeResult}</div>
			<Checkbox
				value="isDisabled"
				label="Make this radio group disabled"
				onChange={toggleCheckbox}
			/>
		</div>
	);
}
