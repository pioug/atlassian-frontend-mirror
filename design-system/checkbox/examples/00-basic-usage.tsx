/**  @jsx jsx */
import { type ChangeEvent, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Checkbox } from '../src';

const resultStyles = css({
	margin: token('space.100', '8px'),
	padding: token('space.100', '8px'),
	borderColor: '#ccc',
	borderStyle: 'dashed',
	borderWidth: token('border.width', '1px'),
	color: '#ccc',
});

export default function BasicUsageExample() {
	const [onChangeResult, setOnChangeResult] = useState('Check & Uncheck to trigger onChange');

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const message = `onChange called with value: ${event.target.value} isChecked: ${event.target.checked}`;
		console.log(message);
		setOnChangeResult(message);
	}, []);

	return (
		<div>
			<Checkbox
				value="Basic checkbox"
				label="Basic checkbox"
				onChange={onChange}
				name="checkbox-basic"
				testId="cb-basic"
			/>
			<Checkbox
				defaultChecked
				label="Checked by default"
				value="Checked by default"
				onChange={onChange}
				name="checkbox-checked"
				testId="cb-default-checked"
			/>
			<Checkbox
				isDisabled
				label="Disabled"
				value="Disabled"
				onChange={onChange}
				name="checkbox-disabled"
				testId="cb-disabled"
			/>
			<Checkbox
				isInvalid
				label="Invalid"
				value="Invalid"
				onChange={onChange}
				name="checkbox-invalid"
				testId="cb-invalid"
			/>

			<div css={resultStyles}>{onChangeResult}</div>
		</div>
	);
}
