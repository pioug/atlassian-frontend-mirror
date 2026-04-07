/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ChangeEvent, type MouseEvent, useCallback, useState } from 'react';

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

export default function ControlledExample(): JSX.Element {
	const [isChecked, setIsChecked] = useState(false);
	const [onChangeResult, setOnChangeResult] = useState('Check & Uncheck to trigger onChange');
	const [onClickResult, setOnClickResult] = useState(
		'Hold shift/alt/cmd (or windows key) when clicking to test those alternative clicks',
	);

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setIsChecked((current) => !current);
		const result = `props.isChecked: ${event.target.checked}`;
		setOnChangeResult(result);
	}, []);

	const onClick = useCallback((event: MouseEvent<HTMLInputElement>) => {
		const meta = event.metaKey ? 'Cmd/Windows key + ' : '';
		const alt = event.altKey ? 'Alt + ' : '';
		const shift = event.shiftKey ? 'Shift + ' : '';
		const result = `type of click: ${meta}${alt}${shift}click`;
		setOnClickResult(result);
	}, []);

	return (
		<div>
			<Checkbox
				isChecked={isChecked}
				onClick={onClick}
				onChange={onChange}
				label="Controlled Checkbox"
				value="Controlled Checkbox"
				name="controlled-checkbox"
			/>

			<div css={resultStyles}>{onChangeResult}</div>
			<div css={resultStyles}>{onClickResult}</div>
		</div>
	);
}
