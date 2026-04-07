/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ChangeEvent, useCallback, useState } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const resultStyles = css({
	borderColor: token('color.border'),
	borderStyle: 'dashed',
	borderWidth: token('border.width', '1px'),
	color: token('color.text.subtle'),
	marginBlockEnd: token('space.100'),
	marginBlockStart: token('space.100'),
	marginInlineEnd: token('space.100'),
	marginInlineStart: token('space.100'),
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
});

export default function BasicUsageExample(): JSX.Element {
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
